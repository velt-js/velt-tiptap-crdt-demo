import React, { useEffect, useRef, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import { VeltTipTapStore as VeltTipTapStore } from '@veltdev/tiptap-crdt';
// import { VeltTipTapStore as VeltTipTapStore2 } from '@velt/crdt-tiptap';
// import { VeltTipTapStore as VeltTipTapStore } from '@veltdev/tiptap-crdt-dev';
import StarterKit from '@tiptap/starter-kit';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
// import { randomColor } from '../utils/colors';
import { useVeltClient, useVeltEventCallback } from '@veltdev/react';

const CollaborativeEditor: React.FC = () => {
  // Create a ref to hold our store instance
  const storeRef = useRef<VeltTipTapStore | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  const { client } = useVeltClient();

  const veltUser = useVeltEventCallback('userUpdate');
  useEffect(() => {
    if (veltUser) {
      console.log('Velt user updated:', veltUser);

    }
  }, [veltUser]);

  // Generate a random user ID and color for this client
  // const userId = useRef(`user-${Math.floor(Math.random() * 100000)}`);
  // const userColor = useRef(randomColor());
  // const userName = useRef(`User ${Math.floor(Math.random() * 100)}`);

  // Initialize the store
  useEffect(() => {
    if (!veltUser || !client) return;

    // Create a clean document name to avoid corrupted documents
    // Use a static name but with a version number to ensure clean state
    const editorId = 'shared-tiptap-doc-1-jul-1';

    // Create the store instance with a static document name for collaboration
    const store = new VeltTipTapStore({ // getVeltTipTapStore({})
      editorId,
      veltClient: client,
    });

    // Store the instance in our ref
    storeRef.current = store;

    // Initialize the store but don't connect the provider yet
    // This prevents conflicts between the store and provider
    store.initialize().then(() => {
      console.log('Store initialized successfully');
      setStoreReady(true);
    }).catch((error: Error) => {
      console.error('Failed to initialize collaborative editor:', error);
    });

    // Set up an observer to log changes (optional, for debugging)
    const unsubscribe = store.getStore().subscribe((value: unknown) => {
      console.log('Document updated:', value);
    });

    unsubscribeRef.current = unsubscribe;

    // Clean up when the component unmounts
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (storeRef.current) {
        storeRef.current.destroy();
      }
    };
  }, [veltUser]);

  // Track when the store is ready
  const [storeReady, setStoreReady] = useState(false);

  // Initialize the editor with our collaboration extension
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false, // Disables default history to use Collaboration's history management
      }),
      ...(storeReady && storeRef.current && veltUser ? [
        // Use ONLY the collaboration extension from the store
        // This already handles the Firestore sync internally
        storeRef.current.getCollabExtension(),
        // Configure the cursor with the same provider
        CollaborationCursor.configure({
          // Use the provider from the store
          provider: storeRef.current.getStore().getProvider(),
          user: {
            name: veltUser?.name,
            color: veltUser?.color,
            // Ensure we have a valid user object with no undefined values
            userId: veltUser?.userId,
          }
        }),
      ] : []),
    ],
    // Set initial content directly to avoid conflicts with YJS initialization
    content: '<p>Hello, collaborative world!</p>'
  }, [storeReady, veltUser]); // Re-initialize when store is ready

  return (
    <div className="editor-container">
      <div className="editor-header">
        Collaborative Editor - {veltUser?.name ? `Editing as ${veltUser.name}` : 'Please login to start editing'}
      </div>
      <div className="editor-content">
        <EditorContent editor={editor} />
      </div>
      <div className="status">
        {storeReady ? 'Connected to collaborative session' : 'Connecting to collaborative session...'}
      </div>
    </div>
  );
};
export default CollaborativeEditor;