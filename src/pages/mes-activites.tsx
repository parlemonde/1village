import { useQueryClient } from 'react-query';
import React from 'react';

import { isPresentation } from 'src/activity-types/anyActivity';
import { isMascotte } from 'src/activity-types/presentation.constants';
import { Base } from 'src/components/Base';
import { Modal } from 'src/components/Modal';
import { ActivityCard } from 'src/components/activities/ActivityCard';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { useActivities } from 'src/services/useActivities';
import { useActivityRequests } from 'src/services/useActivity';
import { ActivityStatus } from 'types/activity.type';

const MesActivites = () => {
  const queryClient = useQueryClient();
  const { user, setUser, axiosLoggedRequest } = React.useContext(UserContext);
  const { setActivity } = React.useContext(ActivityContext);
  const { activities } = useActivities({
    limit: 50,
    page: 0,
    type: -1,
    userId: user?.id ?? 0,
  });
  const { activities: drafts } = useActivities({
    limit: 50,
    page: 0,
    type: -1,
    userId: user?.id ?? 0,
    status: ActivityStatus.DRAFT,
  });
  const { deleteActivity } = useActivityRequests();
  const [deleteIndex, setDeleteIndex] = React.useState<{ index: number; isDraft: boolean }>({ index: -1, isDraft: false });

  const activityToDelete = deleteIndex.index === -1 ? null : deleteIndex.isDraft ? drafts[deleteIndex.index] : activities[deleteIndex.index];
  const onDeleteActivity = async () => {
    if (activityToDelete !== null) {
      await deleteActivity(activityToDelete.id, deleteIndex.isDraft);
    }
    if (isPresentation(activityToDelete) && isMascotte(activityToDelete)) {
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
    setActivity(null);
  }, [setActivity]);

  return (
    <Base>
      <div style={{ width: '100%', padding: '0.5rem 1rem 1rem 1rem' }}>
        <div className="width-900">
          {drafts.length > 0 && <h2>Mes Brouillons</h2>}
          {drafts.map((activity, index) =>
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
          )}

          <h2>Mes activités publiées</h2>
          {activities.map((activity, index) =>
            user && activity.userId === user.id ? (
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

export default MesActivites;
