import { useQueryClient } from 'react-query';
import React from 'react';

import { isMascotte } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { Modal } from 'src/components/Modal';
import { ActivityCard } from 'src/components/activities/ActivityCard';
import { MascotteTemplate } from 'src/components/activities/content/MascotteTemplate';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { useActivities } from 'src/services/useActivities';
import { useActivityRequests } from 'src/services/useActivity';
import type { Activity } from 'types/activity.type';
import { ActivityStatus } from 'types/activity.type';

const MaClasse = () => {
  const queryClient = useQueryClient();
  const { user, setUser, axiosLoggedRequest } = React.useContext(UserContext);
  const { setActivity } = React.useContext(ActivityContext);
  const { activities } = useActivities({
    userId: user?.id ?? 0,
  });
  const { activities: drafts } = useActivities({
    userId: user?.id ?? 0,
    status: ActivityStatus.DRAFT,
  });
  const { deleteActivity } = useActivityRequests();
  const [deleteIndex, setDeleteIndex] = React.useState<{ index: number | 'mascotte'; isDraft: boolean }>({ index: -1, isDraft: false });
  const [mascotteActivity, setMascotteActivity] = React.useState<Activity | null>(null);
  const hasMascotte = mascotteActivity !== null;

  const getMascotte = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: `/activities/mascotte`,
    });
    if (response.error) {
      setMascotteActivity(null);
    } else {
      setMascotteActivity(response.data);
    }
  }, [axiosLoggedRequest]);

  // Get mascotte
  React.useEffect(() => {
    getMascotte().catch();
  }, [getMascotte]);

  // TODO: remove this effect and send the comment count with the mascotte request.
  React.useEffect(() => {
    if (!hasMascotte) {
      return;
    }
    for (const activity of activities || []) {
      if (isMascotte(activity)) {
        setMascotteActivity((m) => ({ ...m, commentCount: activity.commentCount }));
      }
    }
  }, [hasMascotte, activities]);

  // Delete previous activity before going editing other ones.
  React.useEffect(() => {
    setActivity(null);
  }, [setActivity]);

  const activityToDelete =
    deleteIndex.index === -1
      ? null
      : deleteIndex.index === 'mascotte'
      ? mascotteActivity
      : deleteIndex.isDraft
      ? drafts[deleteIndex.index]
      : activities[deleteIndex.index];
  const onDeleteActivity = async () => {
    if (activityToDelete !== null) {
      await deleteActivity(activityToDelete.id, deleteIndex.isDraft);
    }
    if (isMascotte(activityToDelete)) {
      setMascotteActivity(null);
      const newUser = {
        avatar: '',
        displayName: '',
      };
      const response = await axiosLoggedRequest({
        method: 'PUT',
        url: `/users/${user?.id}`,
        data: {
          avatar: '',
          displayName: '',
        },
      });
      if (!response.error) {
        setUser({ ...user, ...newUser });
        queryClient.invalidateQueries('users');
        queryClient.invalidateQueries('village-users');
      }
    }
    setDeleteIndex({ index: -1, isDraft: false });
  };

  const hasNoPublishedActivities = activities.filter((a) => a.userId === user?.id && !isMascotte(a)).length === 0;

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <div className="width-900">
          <h1 style={{ marginBottom: '1rem' }}>Notre mascotte</h1>
          {mascotteActivity ? (
            <ActivityCard
              activity={mascotteActivity}
              user={user}
              showEditButtons
              isSelf
              onDelete={() => {
                setDeleteIndex({ index: 'mascotte', isDraft: false });
              }}
            />
          ) : (
            <MascotteTemplate user={user} />
          )}
          <h1 style={{ margin: '2rem 0 1rem 0' }}>Mes Brouillons</h1>
          {drafts.length === 0 ? (
            <p>Vous n&apos;avez pas de brouillons d&apos;activités en cours.</p>
          ) : (
            drafts.map((activity, index) =>
              user && activity.userId === user.id ? (
                <ActivityCard
                  activity={activity}
                  user={user}
                  key={index}
                  onDelete={() => {
                    setDeleteIndex({ index, isDraft: true });
                  }}
                  isSelf
                  isDraft
                  showEditButtons
                />
              ) : null,
            )
          )}
          <h1 style={{ margin: '2rem 0 1rem 0' }}>Mes activités publiées</h1>
          {hasNoPublishedActivities ? (
            <p>Vous n&apos;avez pas d&apos;activités publiées.</p>
          ) : (
            activities.map((activity, index) =>
              user && activity.userId === user.id && !isMascotte(activity) ? (
                <ActivityCard
                  activity={activity}
                  isSelf={true}
                  user={user}
                  key={index}
                  showEditButtons={true}
                  onDelete={() => {
                    setDeleteIndex({ index, isDraft: false });
                  }}
                />
              ) : null,
            )
          )}
        </div>
      </div>
      <Modal
        open={deleteIndex.index !== -1}
        error
        fullWidth
        maxWidth="sm"
        title="Confirmer la suppression"
        onClose={() => {
          setDeleteIndex({ index: -1, isDraft: false });
        }}
        onConfirm={onDeleteActivity}
        ariaDescribedBy="delete-action-desc"
        ariaLabelledBy="delete-action-title"
      >
        <div>Voulez vous vraiment supprimer cette activité ?</div>
        {activityToDelete && <ActivityCard activity={activityToDelete} isSelf={true} user={user} noButtons />}
      </Modal>
    </Base>
  );
};

export default MaClasse;
