import React from 'react';
import { useQueryClient } from 'react-query';

import { isMascotte } from 'src/activity-types/anyActivity';
import { Base } from 'src/components/Base';
import { Modal } from 'src/components/Modal';
import { ActivityCard } from 'src/components/activities/ActivityCard';
import { ActivityContext } from 'src/contexts/activityContext';
import { UserContext } from 'src/contexts/userContext';
import { useActivities } from 'src/services/useActivities';
import { useActivityRequests } from 'src/services/useActivity';
import { axiosRequest } from 'src/utils/axiosRequest';
import { ActivityStatus } from 'types/activity.type';

const MesActivites = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = React.useContext(UserContext);
  const { setActivity } = React.useContext(ActivityContext);
  const { activities } = useActivities({
    limit: 200,
    page: 0,
    type: [],
    userId: user?.id ?? 0,
  });
  const { activities: drafts } = useActivities({
    limit: 200,
    page: 0,
    type: [],
    userId: user?.id ?? 0,
    status: ActivityStatus.DRAFT,
  });
  const { deleteActivity } = useActivityRequests();
  const [deleteIndex, setDeleteIndex] = React.useState<{ index: number; isDraft: boolean }>({ index: -1, isDraft: false });

  const activityToDelete = deleteIndex.index === -1 ? null : deleteIndex.isDraft ? drafts[deleteIndex.index] : activities[deleteIndex.index];
  const onDeleteActivity = async () => {
    if (activityToDelete === null) {
      return;
    }
    await deleteActivity(activityToDelete.id, deleteIndex.isDraft);
    if (isMascotte(activityToDelete)) {
      const newUser = {
        avatar: '',
        displayName: '',
      };
      const response = await axiosRequest({
        method: 'PUT',
        url: `/users/${user?.id}`,
        data: {
          avatar: '',
          displayName: '',
        },
      });
      if (!response.error && user !== null) {
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
        {activityToDelete && user && <ActivityCard activity={activityToDelete} isSelf={true} user={user} noButtons />}
      </Modal>
    </Base>
  );
};

export default MesActivites;
