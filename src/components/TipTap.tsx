import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useVeltClient, useVeltEventCallback } from '@veltdev/react';
import { VeltTipTapStore, createVeltTipTapStore } from '@veltdev/tiptap-crdt';
import { User } from '@veltdev/types';
import React, { useEffect, useRef, useState } from 'react';

const CollaborativeEditor: React.FC = () => {
  // Create a ref to hold our store instance
  const veltTiptapStoreRef = useRef<VeltTipTapStore | null>(null);

  const { client } = useVeltClient();

  const veltUser = useVeltEventCallback('userUpdate');

  // Initialize the store
  useEffect(() => {
    if (!veltUser || !client) return;

    initializeStore();

    // Clean up when the component unmounts
    return () => {
      if (veltTiptapStoreRef.current) {
        veltTiptapStoreRef.current.destroy();
      }
    };
  }, [client, veltUser]);

  const initializeStore = async () => {
    const veltTiptapStore = await createVeltTipTapStore({ editorId: 'velt-tiptap-crdt-demo-1-28-aug-2025', veltClient: client! });
    veltTiptapStoreRef.current = veltTiptapStore;
    setVeltTiptapStoreReady(true);
  }

  // Track when the store is ready
  const [veltTiptapStoreReady, setVeltTiptapStoreReady] = useState(false);

  // Initialize the editor with our collaboration extension
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false, // Disables default history to use Collaboration's history management
      }),
      ...(
        veltTiptapStoreRef.current ?
          [
            // Use ONLY the collaboration extension from the store
            // This already handles the Firestore sync internally
            veltTiptapStoreRef.current.getCollabExtension(),
            // Configure the cursor with the same provider
            CollaborationCursor.configure({
              // Use the provider from the store
              provider: veltTiptapStoreRef.current.getStore().getProvider(),
              user: veltUser as User,
            }),
          ]
          : []
      ),
    ],
    // Set initial content directly to avoid conflicts with YJS initialization
    content: ''
  }, [veltTiptapStoreReady, veltUser]); // Re-initialize when store is ready

  return (
    <div className="editor-container">
      <div className="editor-header">
        Collaborative Editor - {veltUser?.name ? `Editing as ${veltUser.name}` : 'Please login to start editing'}
      </div>
      <div className="editor-content">
        <EditorContent editor={editor} />
      </div>
      <div className="status">
        {veltTiptapStoreReady ? 'Connected to collaborative session' : 'Connecting to collaborative session...'}
      </div>
    </div>
  );
};
export default CollaborativeEditor;