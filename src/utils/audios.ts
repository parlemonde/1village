import type { AxiosRequestConfig } from 'axios';

import type { Sample } from 'src/activity-types/anthem.types';
import type { AxiosReturnType } from 'src/utils/axiosRequest';

export const mixAudios = async (audios: Partial<Sample>[], req: (arg: AxiosRequestConfig) => Promise<AxiosReturnType>) => {
  const sources: string[] = [];
  audios.forEach((audio) => audio.value && sources.push(audio.value));
  const get = (src: string) => fetch(src).then((response) => response.arrayBuffer());

  return await Promise.all(sources.map(get))
    .then((data) => {
      const len = Math.max(...data.map((buffer) => buffer.byteLength));
      const context = new OfflineAudioContext(2, len, 44100);
      // TODO : change logic in order to refacto the double calls
      const getDecoded = (src: string) =>
        fetch(src).then((response) => response.arrayBuffer().then((arrayBuffer) => context.decodeAudioData(arrayBuffer)));
      return Promise.all(sources.map(getDecoded)).then(async (data) => {
        const audioBuffer = mergeBuffers(data, context);
        const audio = new AudioContext();
        const mixedAudio = audio.createMediaStreamDestination();
        const mix = audio.createBufferSource();
        mix.buffer = audioBuffer;
        mix.connect(audio.destination);
        mix.connect(mixedAudio);

        const formData = new FormData();
        formData.append('audio', new Blob([audioBufferToWav(audioBuffer)], { type: 'audio/vnd.wav' }), 'anthemTemplate.wav');
        const response = await req({
          method: 'POST',
          url: '/audios',
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        return response.data.url;
      });
    })
    .catch(() => {
      return null;
    });
};

export const concatAudios = async (audios: Partial<Sample>[], req: (arg: AxiosRequestConfig) => Promise<AxiosReturnType>) => {
  const sources: string[] = [];
  audios.forEach((audio) => audio.value && sources.push(audio.value));
  if (sources.length === 0) return;
  const audioContext = new AudioContext();
  const getDecoded = (src: string) =>
    fetch(src).then((response) => response.arrayBuffer().then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer)));
  return Promise.all(sources.map(getDecoded)).then(async (buffers) => {
    const combinedBufferLength = buffers.map((b) => b.length).reduce((s, l) => s + l);
    const combinedBuffer = audioContext.createBuffer(2, combinedBufferLength, buffers[0].sampleRate);
    let index = 0;
    for (let i = 0; i < buffers.length; ++i) {
      copyBufferToBuffer({
        srcBuffer: buffers[i],
        destBuffer: combinedBuffer,
        srcOffset: 0,
        destOffset: index,
        desiredNumberOfChannels: 2,
      });
      index += buffers[i].length;
    }

    const audio = new AudioContext();
    const mixedAudio = audio.createMediaStreamDestination();
    const mix = audio.createBufferSource();
    mix.buffer = combinedBuffer;
    mix.connect(audio.destination);
    mix.connect(mixedAudio);

    const formData = new FormData();
    formData.append('audio', new Blob([audioBufferToWav(combinedBuffer)], { type: 'audio/vnd.wav' }), 'finalMix.wav');
    const response = await req({
      method: 'POST',
      url: '/audios',
      data: formData,
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data.url;
  });
};

type copyBufferTobufferType = {
  srcBuffer: AudioBuffer;
  destBuffer: AudioBuffer;
  srcOffset: number;
  destOffset: number;
  desiredNumberOfChannels: number;
};

const copyBufferToBuffer = ({ srcBuffer, destBuffer, srcOffset, destOffset, desiredNumberOfChannels }: copyBufferTobufferType) => {
  const totalFrames = srcBuffer.length;

  const array0 = new Float32Array(totalFrames);
  const array1 = new Float32Array(totalFrames);
  if (typeof srcBuffer.copyFromChannel === 'function') {
    srcBuffer.copyFromChannel(array0, 0, srcOffset);
    if (desiredNumberOfChannels === 2) {
      if (srcBuffer.numberOfChannels > 1) {
        srcBuffer.copyFromChannel(array1, 1, srcOffset);
      } else {
        // Just copy the first channel as the second channel.
        srcBuffer.copyFromChannel(array1, 0, srcOffset);
      }
    }
  }

  if (typeof destBuffer.copyToChannel === 'function') {
    destBuffer.copyToChannel(array0, 0, destOffset);
    if (desiredNumberOfChannels === 2) {
      destBuffer.copyToChannel(array1, 1, destOffset);
    }
  }
};

export const audioBufferToWav = (buffer: AudioBuffer, opt: { float32?: boolean } = {}) => {
  const numChannels = buffer.numberOfChannels;
  const sampleRate = buffer.sampleRate;
  const format = opt.float32 ? 3 : 1;
  const bitDepth = format === 3 ? 32 : 16;

  let result;
  if (numChannels === 2) {
    result = interleave(buffer.getChannelData(0), buffer.getChannelData(1));
  } else {
    result = buffer.getChannelData(0);
  }

  return encodeWAV(result, format, sampleRate, numChannels, bitDepth);
};

const encodeWAV = (samples: Float32Array, format: number, sampleRate: number, numChannels: number, bitDepth: number) => {
  const bytesPerSample = bitDepth / 8;
  const blockAlign = numChannels * bytesPerSample;

  const buffer = new ArrayBuffer(44 + samples.length * bytesPerSample);
  const view = new DataView(buffer);

  /* RIFF identifier */
  writeString(view, 0, 'RIFF');
  /* RIFF chunk length */
  view.setUint32(4, 36 + samples.length * bytesPerSample, true);
  /* RIFF type */
  writeString(view, 8, 'WAVE');
  /* format chunk identifier */
  writeString(view, 12, 'fmt ');
  /* format chunk length */
  view.setUint32(16, 16, true);
  /* sample format (raw) */
  view.setUint16(20, format, true);
  /* channel count */
  view.setUint16(22, numChannels, true);
  /* sample rate */
  view.setUint32(24, sampleRate, true);
  /* byte rate (sample rate * block align) */
  view.setUint32(28, sampleRate * blockAlign, true);
  /* block align (channel count * bytes per sample) */
  view.setUint16(32, blockAlign, true);
  /* bits per sample */
  view.setUint16(34, bitDepth, true);
  /* data chunk identifier */
  writeString(view, 36, 'data');
  /* data chunk length */
  view.setUint32(40, samples.length * bytesPerSample, true);
  if (format === 1) {
    // Raw PCM
    floatTo16BitPCM(view, 44, samples);
  } else {
    writeFloat32(view, 44, samples);
  }

  return buffer;
};

const interleave = (inputL: Float32Array, inputR: Float32Array) => {
  const length = inputL.length + inputR.length;
  const result = new Float32Array(length);

  let index = 0;
  let inputIndex = 0;

  while (index < length) {
    result[index++] = inputL[inputIndex];
    result[index++] = inputR[inputIndex];
    inputIndex++;
  }
  return result;
};

const writeFloat32 = (output: DataView, offset: number, input: Float32Array) => {
  for (let i = 0; i < input.length; i++, offset += 4) {
    output.setFloat32(offset, input[i], true);
  }
};

const floatTo16BitPCM = (output: DataView, offset: number, input: Float32Array) => {
  for (let i = 0; i < input.length; i++, offset += 2) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
  }
};

const writeString = (view: DataView, offset: number, string: string) => {
  for (let i = 0; i < string.length; i++) {
    view.setUint8(offset + i, string.charCodeAt(i));
  }
};

const mergeBuffers = (buffers: AudioBuffer[], ac: OfflineAudioContext) => {
  let maxChannels = 0;
  let maxDuration = 0;

  for (let i = 0; i < buffers.length; i++) {
    if (buffers[i].numberOfChannels > maxChannels) {
      maxChannels = buffers[i].numberOfChannels;
    }
    if (buffers[i].duration > maxDuration) {
      maxDuration = buffers[i].duration;
    }
  }
  const out = ac.createBuffer(maxChannels, ac.sampleRate * maxDuration, ac.sampleRate);

  for (let j = 0; j < buffers.length; j++) {
    for (let srcChannel = 0; srcChannel < buffers[j].numberOfChannels; srcChannel++) {
      const outt = out.getChannelData(srcChannel);
      const inn = buffers[j].getChannelData(srcChannel);
      for (let i = 0; i < inn.length; i++) {
        outt[i] += inn[i];
      }
      out.getChannelData(srcChannel).set(outt, 0);
    }
  }
  return out;
};

export const audioBufferSlice = async (url: string, begin: number, end: number, callback: (newArrayBuffer: AudioBuffer) => void) => {
  const get = (src: string) => fetch(src).then((response) => response.arrayBuffer());
  const audioArrayBuffer = await get(url);
  const audioContext = new OfflineAudioContext(2, audioArrayBuffer.byteLength, 44100);
  const getDecoded = (src: string) =>
    fetch(src).then((response) => response.arrayBuffer().then((arrayBuffer) => audioContext.decodeAudioData(arrayBuffer)));
  let buffer = await getDecoded(url);

  if (buffer.numberOfChannels === 1) {
    const newBuffer = audioContext.createBuffer(2, buffer.length, buffer.sampleRate);
    const myData = new Float32Array(buffer.length);
    buffer.copyFromChannel(myData, 0);
    newBuffer.copyToChannel(myData, 0);
    newBuffer.copyToChannel(myData, 1);
    buffer = newBuffer;
  }

  const duration = buffer.duration;
  const channels = buffer.numberOfChannels;
  const rate = buffer.sampleRate;

  if (typeof end === 'function') {
    callback = end;
    end = duration;
  }

  // milliseconds to seconds
  begin = begin / 1000;
  end = end / 1000;

  if (begin < 0) {
    begin = 0;
  }

  if (end > duration) {
    end = duration;
  }

  const startOffset = rate * begin;
  const endOffset = rate * end;
  const frameCount = endOffset - startOffset;
  const newArrayBuffer = audioContext.createBuffer(channels, endOffset - startOffset, rate);
  const anotherArray = new Float32Array(frameCount);
  const offset = 0;

  for (let channel = 0; channel < channels; channel++) {
    buffer.copyFromChannel(anotherArray, channel, startOffset);
    newArrayBuffer.copyToChannel(anotherArray, channel, offset);
  }

  callback(newArrayBuffer);
};
