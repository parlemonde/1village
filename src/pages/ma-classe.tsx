import { useQueryClient } from 'react-query';
import React from 'react';

import type { AnyActivity } from 'src/activity-types/anyActivity.types';
import { getAnyActivity, isPresentation } from 'src/activity-types/anyActivity';
import { isMascotte } from 'src/activity-types/presentation.constants';
import { Base } from 'src/components/Base';
import { Modal } from 'src/components/Modal';
import { ActivityCard } from 'src/components/activities/ActivityCard';
import { MascotteTemplate } from 'src/components/activities/content/MascotteTemplate';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { useActivities } from 'src/services/useActivities';
import { useActivityRequests } from 'src/services/useActivity';
import { ActivityStatus } from 'types/activity.type';

const MaClasse = () => {
  const queryClient = useQueryClient();
  const { user, setUser, axiosLoggedRequest } = React.useContext(UserContext);
  const { setActivity } = React.useContext(ActivityContext);
  const { activities } = useActivities({
    limit: 50,
    page: 0,
    type: [],
    userId: user?.id ?? 0,
  });
  const { activities: drafts } = useActivities({
    limit: 50,
    page: 0,
    type: [],
    userId: user?.id ?? 0,
    status: ActivityStatus.DRAFT,
  });
  const { deleteActivity } = useActivityRequests();
  const [deleteIndex, setDeleteIndex] = React.useState<{ index: number; isDraft: boolean }>({ index: -1, isDraft: false });
  const [hasMascotte, setHasMascotte] = React.useState(true);
  const [mascotteActivity, setMascotteActivity] = React.useState<AnyActivity>();

  const getMascotte = React.useCallback(async () => {
    const response = await axiosLoggedRequest({
      method: 'GET',
      url: `/activities/mascotte`,
    });
    if (!response.error && response.data.id === -1) {
      setHasMascotte(false);
    } else {
      const res = await axiosLoggedRequest({
        method: 'GET',
        url: `/activities/${response.data.id}`,
      });
      setMascotteActivity(getAnyActivity(res.data));

      activities &&
        activities.map((activity) => {
          isMascotte(activity) && setMascotteActivity({ ...mascotteActivity, commentCount: activity.commentCount });
        });
    }
  }, [activities, axiosLoggedRequest]);

  const activityToDelete = deleteIndex.index === -1 ? null : deleteIndex.isDraft ? drafts[deleteIndex.index] : activities[deleteIndex.index];
  const onDeleteActivity = async (mascotteActivity: AnyActivity = null, isDraft = false) => {
    if (activityToDelete !== null) {
      await deleteActivity(activityToDelete.id, deleteIndex.isDraft);
    }
    if (mascotteActivity || (isPresentation(activityToDelete) && isMascotte(activityToDelete))) {
      mascotteActivity && (await deleteActivity(mascotteActivity.id, isDraft));
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

  // Delete previous activity before going editing other ones.
  React.useEffect(() => {
    getMascotte();
    setActivity(null);
  }, [activities, setActivity]);

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <div className="width-900">
          <h2>Notre mascotte</h2>
          {hasMascotte && mascotteActivity ? (
            <ActivityCard activity={mascotteActivity} user={user} showEditButtons isSelf onDelete={() => onDeleteActivity(mascotteActivity)} />
          ) : (
            <MascotteTemplate user={user} />
          )}
          <h2>Mes Brouillons</h2>
          {drafts.length === 0 && <p>Vous n&apos;avez pas de brouillons d&apos;activités en cours.</p>}
          {drafts.map((activity, index) =>
            user && activity.userId === user.id && !isPresentation(activity) && !isMascotte(activity) ? (
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
          )}

          <h2>Mes activités publiées</h2>
          {activities.map((activity, index) =>
            user && activity.userId === user.id && !isPresentation(activity) && !isMascotte(activity) ? (
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
