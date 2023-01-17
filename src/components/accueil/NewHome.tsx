import React from 'react';

import { SignInParent } from './SignInParent';
import { SignInTeacher } from './SignInTeacher';
import { TeacherOrParent } from './TeacherOrParent';

export interface SetPageProps {
  page: { intro: boolean; parent: boolean; teacher: boolean };
  setPage: React.Dispatch<React.SetStateAction<{ intro: boolean; parent: boolean; teacher: boolean }>>;
}

export function isRedirectValid(redirect: string) {
  // inner redirection.
  if (redirect.startsWith('/')) return true;
  // external, allow only same domain.
  try {
    const url = new URL(redirect);
    return url.hostname.slice(-15) === '.parlemonde.org';
  } catch {
    return false;
  }
}

export const NewHome = () => {
  const [page, setPage] = React.useState({ intro: true, parent: false, teacher: false });

  return (
    <div className="bg-gradiant" style={{ display: 'flex', flexDirection: 'column' }}>
      {page.intro ? <TeacherOrParent setPage={setPage} page={page} /> : null}
      {page.parent ? <SignInParent setPage={setPage} page={page} /> : null}
      {page.teacher ? <SignInTeacher setPage={setPage} page={page} /> : null}
    </div>
  );
};
