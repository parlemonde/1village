import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import React, { useEffect, useState } from 'react';
import { useQueryClient } from 'react-query';

import Button from '@mui/material/Button';

import { usePelicoPresentation } from 'src/api/pelicoPresentation/pelicoPresentation.get';
import { useCreatePelicoPresentation } from 'src/api/pelicoPresentation/pelicoPresentation.post';
import { useUpdatePelicoPresentation } from 'src/api/pelicoPresentation/pelicoPresentation.put';
import { ContentEditor } from 'src/components/activities/content';
import { UserContext } from 'src/contexts/userContext';
import BackArrow from 'src/svg/back-arrow.svg';
import type { PelicoPresentation, PelicoPresentationContent, PelicoPresentationContentType } from 'types/pelicoPresentation.type';
import { UserType } from 'types/user.type';

const Pelico = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { user } = React.useContext(UserContext);
  const hasAccess = user !== null && user.type in [UserType.MEDIATOR, UserType.ADMIN, UserType.SUPER_ADMIN];
  const [presentation, setPresentation] = useState<PelicoPresentation>({ content: [], id: 1 });
  const { enqueueSnackbar } = useSnackbar();

  const { data: presentationData, isLoading: presentationLoading, isSuccess: presentationSuccess } = usePelicoPresentation(1);
  const { mutate: createPresentation, isLoading: createLoading, isSuccess: createSuccess, isError: createError } = useCreatePelicoPresentation();
  const { mutate: updatePresentation, isLoading: updateLoading, isSuccess: updateSuccess, isError: updateError } = useUpdatePelicoPresentation();

  useEffect(() => {
    if (presentationSuccess) {
      if (presentationData !== null) {
        setPresentation(presentationData);
      }
    }
    if (createSuccess || updateSuccess) {
      queryClient.invalidateQueries({ queryKey: ['activities'] });
      enqueueSnackbar('Modifications enregistrées !', {
        variant: 'success',
      });
      router.push('/admin/newportal/manage/settings');
    }
    if (createError || updateError) {
      enqueueSnackbar("Une erreur s'est produite lors de la modifications !", {
        variant: 'error',
      });
      router.push('/admin/newportal/manage/settings');
    }
  }, [presentationSuccess, createSuccess, updateSuccess, createError, updateError, queryClient, enqueueSnackbar, presentationData, router]);

  if (!hasAccess) {
    return <h1>Vous n&apos;avez pas accès à cette page, vous devez être médiateur, modérateur ou super admin.</h1>;
  }
  if (createLoading || presentationLoading || updateLoading) {
    return <div>Loading...</div>;
  }

  const updateContent = (content: PelicoPresentationContent[]) => {
    if (!presentation) return;
    updateActivity({ content: content });
  };

  const addContent = (type: PelicoPresentationContentType, value: string = '', index?: number) => {
    if (!presentation) {
      return;
    }
    const newContent = presentation.content ? [...presentation.content] : [];
    const newId = Math.max(1, ...newContent.map((p) => p.id)) + 1;
    if (index !== undefined) {
      newContent.splice(index, 0, {
        id: newId,
        type,
        value,
      });
    } else {
      newContent.push({
        id: newId,
        type,
        value,
      });
    }
    updateActivity({ content: newContent });
  };

  const deleteContent = (index: number) => {
    if (!presentation) {
      return;
    }
    const newContent = presentation.content ? [...presentation.content] : [];
    if (newContent.length <= index) {
      return;
    }
    newContent.splice(index, 1);
    updateActivity({ content: newContent });
  };

  const updateActivity = (updatedContent: PelicoPresentationContent[]) => {
    setPresentation((a) => (a === null ? a : { ...a, ...updatedContent }));
  };

  const onSave = () => {
    if (presentationData == null) {
      createPresentation(presentation.content);
    } else {
      updatePresentation(presentation);
    }
  };

  return (
    <div>
      <Link href="/admin/newportal/manage/settings">
        <div style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
          <BackArrow />
          <h1 style={{ marginLeft: '10px' }}>Présentation de Pélico</h1>
        </div>
      </Link>
      <ContentEditor content={presentation.content} updateContent={updateContent} addContent={addContent} deleteContent={deleteContent} />
      <div style={{ width: '100%', textAlign: 'right', margin: '1rem 0' }}>
        <Button variant="outlined" color="primary" onClick={onSave}>
          Valider
        </Button>
      </div>
    </div>
  );
};

export default Pelico;
