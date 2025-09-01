import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useVeltEventCallback } from '@veltdev/react';
import { useVeltTiptapCrdtExtension } from '@veltdev/tiptap-crdt-react';
import React from 'react';

const CollaborativeEditor: React.FC = () => {

  const veltUser = useVeltEventCallback('userUpdate');
  const veltTiptapCrdtExtension = useVeltTiptapCrdtExtension({
    editorId: 'velt-tiptap-crdt-demo-1-1-sept-2025'
  });
  // Initialize the editor with our collaboration extension
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false,
      }),
      ...(veltTiptapCrdtExtension ? [veltTiptapCrdtExtension] : []),
    ],
    content: ''
  }, [veltTiptapCrdtExtension]);

  return (
    <div className="editor-container">
      <div className="editor-header">
        Collaborative Editor - {veltUser?.name ? `Editing as ${veltUser.name}` : 'Please login to start editing'}
      </div>
      <div className="editor-content">
        <EditorContent editor={editor} />
      </div>
      <div className="status">
        {veltTiptapCrdtExtension ? 'Connected to collaborative session' : 'Connecting to collaborative session...'}
      </div>
    </div>
  );
};
export default CollaborativeEditor;