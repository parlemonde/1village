import base64url from 'base64url';
import crypto from 'crypto';
import type { Request } from 'express';
import fs from 'fs';
import { In } from 'typeorm';

import { Activity } from '../entities/activity';
import { Classroom } from '../entities/classroom';
import { Student } from '../entities/student';
import { User, UserType } from '../entities/user';
import { UserToStudent } from '../entities/userToStudent';
import { AppDataSource } from './data-source';

/**
 * Pause the program for x milliseconds.
 * @param ms
 */
export function sleep(ms: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

export function getHeader(req: Request, header: string): string | undefined {
  const headers: string | string[] | undefined = req.headers[header];
  if (typeof headers === 'string') {
    return headers;
  } else if (headers !== undefined) {
    return headers[0] || undefined;
  }
  return undefined;
}

export function isPasswordValid(password: string): boolean {
  return (
    password !== undefined && password !== null && password.length >= 8 && /\d+/.test(password) && /[a-z]+/.test(password) && /[A-Z]+/.test(password)
  );
}

export function generateTemporaryToken(length: number): string {
  return base64url(crypto.randomBytes(length)).slice(0, length);
}

export function valueOrDefault<T>(value: T | null | undefined, defaultValue: T, nullable?: false): T;
export function valueOrDefault<T>(value: T | null | undefined, defaultValue: T, nullable: true): T | null;
export function valueOrDefault<T>(value: T | null | undefined, defaultValue: T, nullable: boolean = false): T | null {
  if (value === undefined || (value === null && !nullable)) {
    return defaultValue;
  }
  return value;
}

export function getBase64File(path: string): string {
  return fs.readFileSync(path).toString('base64');
}

export function serializeToQueryUrl(obj: { [key: string]: string | number | boolean }): string {
  if (Object.keys(obj).length === 0) {
    return '';
  }
  const str =
    '?' +
    Object.keys(obj)
      .reduce<string[]>(function (a, k) {
        a.push(`${k}=${encodeURIComponent(obj[k])}`);
        return a;
      }, [])
      .join('&');
  return str;
}

export function decodeBase64(base64Encoded: string): string {
  const buffer = Buffer.from(base64Encoded, 'base64');
  return buffer.toString('utf-8');
}

export function getQueryString(q: unknown | unknown[] | undefined): string | undefined {
  if (Array.isArray(q) && q.length > 0 && typeof q[0] === 'string') {
    return q[0];
  }
  if (typeof q === 'string') {
    return q;
  }
  return undefined;
}

export async function updateVillageData(user: User, data: { villageId: number }): Promise<void> {
  if (user.type === UserType.TEACHER) {
    const classroom = await AppDataSource.getRepository(Classroom).findOne({ where: { user: { id: user.id } } });

    const students = await AppDataSource.getRepository(Student).find({ where: { classroom: { id: classroom?.id } } });
    const studentsId = students.map((student) => student.id);

    const families = await AppDataSource.getRepository(UserToStudent).find({
      where: { student: { id: In(studentsId) } },
      relations: ['user', 'student'],
    });

    const familiesId = families.map((family) => family.user.id);

    const promises = [];

    promises.push(
      AppDataSource.getRepository(Classroom).update({ user: { id: user.id } }, { villageId: data.villageId }),
      AppDataSource.getRepository(Activity).update({ userId: user.id }, { villageId: data.villageId }),
      AppDataSource.getRepository(User).update({ id: In(familiesId) }, { villageId: data.villageId }),
      AppDataSource.getRepository(User).update({ id: user.id }, { villageId: data.villageId }),
    );

    await Promise.all(promises);
  }
}
