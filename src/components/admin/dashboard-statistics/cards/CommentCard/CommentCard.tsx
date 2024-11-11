import EditIcon from '@mui/icons-material/Edit'; // Assurez-vous que ce package est installé ou utilisez une autre icône.
import React from 'react';

import styles from './CommentCard.module.css';

const CommentCard = () => {
  return (
    <div className={styles.commentCard}>
      <span className={styles.commentText}>{`Commentaire de l'équipe :`}</span>
      <div className={styles.editIcon}>
        <EditIcon />
      </div>
    </div>
  );
};

export default CommentCard;
