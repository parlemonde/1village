import ReactPlayer from "react-player";
import React from "react";

import { Button, Divider, TextField, Tooltip } from "@material-ui/core";
import ArrowRightAltIcon from "@material-ui/icons/ArrowRightAlt";
import CloudUploadIcon from "@material-ui/icons/CloudUpload";
import { Alert } from "@material-ui/lab";

import { Modal } from "src/components/Modal";
// import { Steps } from "src/components/Steps";
import { isValidHttpUrl } from "src/utils";

interface VidoeEditorProps {
  id: number;
  value?: string;
  onChange?(newValue: string): void;
  onDelete?(): void;
}

const VideoEditor: React.FC<VidoeEditorProps> = ({ id, value = "", onChange = () => {}, onDelete = () => {} }: VidoeEditorProps) => {
  const [videoUrl, setVideoUrl] = React.useState(value);
  const [tempVideoUrl, setTempVideoUrl] = React.useState("");
  const [preview, setPreview] = React.useState<{ url: string; mode: number }>({
    url: "",
    mode: 0,
  }); // 0 no preview, 1: preview, 2: error
  const [currentStep, setCurrentStep] = React.useState(value === "" ? 1 : 0);
  const [file, setFile] = React.useState<File | null>(null);
  const inputFile = React.useRef<HTMLInputElement>(null);

  // On value change, update image.
  const prevValue = React.useRef(value);
  React.useEffect(() => {
    if (prevValue.current !== value) {
      prevValue.current = value;
      setVideoUrl(value);
    }
  }, [value]);

  const displayPreview = async () => {
    if (ReactPlayer.canPlay(tempVideoUrl)) {
      setPreview({
        mode: 1,
        url: tempVideoUrl,
      });
    } else {
      setPreview({
        mode: 2,
        url: "",
      });
    }
  };
  const resetPreview = () => {
    setPreview({
      mode: 0,
      url: "",
    });
  };

  const onChangeVideo = React.useCallback(
    (newValue: string) => {
      prevValue.current = newValue;
      onChange(newValue);
      setVideoUrl(newValue);
    },
    [onChange],
  );

  const onFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    const filesArr = Array.prototype.slice.call(files) as File[];
    if (filesArr.length > 0) {
      setFile(filesArr[0]);
      setTempVideoUrl(URL.createObjectURL(filesArr[0]));
      setPreview({
        mode: 1,
        url: URL.createObjectURL(filesArr[0]),
      });
    } else {
      setFile(null);
      setTempVideoUrl("");
      resetPreview();
    }
  };

  return (
    <div>
      <div className="image-editor">
        {videoUrl && (
          <>
            <div className="text-center" style={{ height: "9rem", borderRight: "1px dashed #4c3ed9" }}>
              <div
                style={{
                  display: "inline-block",
                  width: "16rem",
                  height: "9rem",
                }}
              >
                <ReactPlayer width="100%" height="100%" light url={videoUrl} controls />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Button
                variant="outlined"
                size="small"
                color="primary"
                onClick={() => {
                  setCurrentStep(1);
                }}
              >
                {"Changer de vidéo"}
              </Button>
            </div>
          </>
        )}
      </div>
      <Modal
        open={currentStep > 0}
        fullWidth
        noCloseOutsideModal
        maxWidth="md"
        title="Choisir une vidéo"
        confirmLabel="Choisir"
        onConfirm={() => {
          onChangeVideo(tempVideoUrl);
          setCurrentStep(0);
        }}
        onClose={() => {
          setCurrentStep(0);
          if (videoUrl.length === 0) {
            onDelete();
          }
        }}
        disabled={preview.mode !== 1}
        ariaLabelledBy={`video-edit-${id}`}
        ariaDescribedBy={`video-edit-${id}-desc`}
      >
        <div style={{ padding: "0.5rem" }}>
          <Alert icon={<ArrowRightAltIcon />} severity="info">
            Créer une vidéo sur{" "}
            <a className="text text--bold" href="https://clap.parlemonde.org" target="_blank" rel="noreferrer">
              Clap!
            </a>
          </Alert>
        </div>
        <div style={{ display: "flex", width: "100%", height: "20rem" }}>
          <div style={{ flex: 1, height: "100%", padding: "4rem 0.5rem" }}>
            <div id={`image-edit-${id}-desc`}>
              {/* <Steps steps={["Choisir la vidéo", "Paramètres"]} activeStep={0} /> */}
              {currentStep === 1 && (
                <>
                  <TextField
                    label="Entrez l'URL de la vidéo"
                    variant="outlined"
                    color="secondary"
                    fullWidth
                    value={file === null ? tempVideoUrl : ""}
                    onBlur={() => {
                      if (isValidHttpUrl(tempVideoUrl)) {
                        displayPreview();
                      } else {
                        resetPreview();
                      }
                    }}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      if (file !== null) {
                        setFile(null);
                        resetPreview();
                        if (inputFile.current) {
                          inputFile.current.value = "";
                        }
                      }
                      setTempVideoUrl(event.target.value);
                    }}
                  />
                  <Divider style={{ marginTop: "2rem" }} />
                  <div className="text-center" style={{ margin: "-0.8rem 0 1.5rem 0" }}>
                    <span style={{ backgroundColor: "white", padding: "0 0.5rem", color: "#666666", fontSize: "1.1rem" }}>Ou</span>
                  </div>
                  <div className="text-center">
                    <Tooltip title="Bientôt disponible !" aria-label="available soon">
                      <span>
                        <Button
                          disabled
                          component="label"
                          variant="outlined"
                          color="secondary"
                          startIcon={<CloudUploadIcon />}
                          style={{ cursor: "pointer" }}
                        >
                          <>
                            Importer
                            <input
                              ref={inputFile}
                              type="file"
                              multiple={false}
                              accept="video/*"
                              style={{ display: "none" }}
                              onChange={onFileSelect}
                            />
                          </>
                        </Button>
                      </span>
                    </Tooltip>
                  </div>
                  {/* <div style={{ width: "100%", textAlign: "right" }}>
                    <Button color="primary" variant="contained" disabled={preview.mode !== 1}>
                      Suivant
                    </Button>
                  </div> */}
                </>
              )}
            </div>
          </div>
          <div style={{ flex: "1", padding: "0.5rem" }}>
            <div style={{ width: "100%", height: "100%", backgroundColor: "#f5f5f5", padding: "0.5rem" }}>
              <div className="text-center text text--bold" style={{ height: "10%" }}>
                Aperçu
              </div>
              {preview.mode === 1 && (
                <div style={{ width: "100%", height: "90%" }}>
                  <ReactPlayer width="100%" height="100%" light url={preview.url} controls />
                </div>
              )}
              {preview.mode === 2 && <Alert severity="error">{"Erreur: impossible de lire cette vidéo."}</Alert>}
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default VideoEditor;
