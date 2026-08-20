import React, { useState } from 'react';
import { Button, Modal, StyleSheet, Text, View } from 'react-native';
import { deleteJobPost } from '../model/deleteJobPost';

const DeletePostButton = ({ postId }: { postId: string }) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [notification, setNotification] = useState({
    visible: false,
    title: '',
    message: '',
  });

  const showNotification = (title: string, message: string) => {
    setNotification({ visible: true, title, message });
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    try {
      await deleteJobPost(postId);
      showNotification('Success', 'Post deleted successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to delete post';
      showNotification('Error', errorMessage);
      console.error('Delete post error:', error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Button
        title={isDeleting ? 'Deleting...' : 'Delete post'}
        onPress={handleDelete}
        disabled={isDeleting}
      />

      <Modal
        transparent
        visible={notification.visible}
        animationType="fade"
        onRequestClose={() => setNotification((prev) => ({ ...prev, visible: false }))}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{notification.title}</Text>
            <Text style={styles.modalMessage}>{notification.message}</Text>
            <View style={styles.modalButton}>
              <Button
                title="OK"
                onPress={() => setNotification((prev) => ({ ...prev, visible: false }))}
              />
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.35)',
    padding: 24,
  },
  modalCard: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: '600', marginBottom: 8, color: '#111' },
  modalMessage: { fontSize: 14, color: '#444', marginBottom: 16 },
  modalButton: { alignSelf: 'flex-end' },
});

export default DeletePostButton;
