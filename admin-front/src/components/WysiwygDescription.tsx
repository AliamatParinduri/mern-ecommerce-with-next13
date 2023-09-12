import dynamic from 'next/dynamic'
import { EditorProps } from 'react-draft-wysiwyg'

type Props = {
  title: string
  editorState: any
  setEditorState: any
}

const Editor = dynamic<EditorProps>(
  () => import('react-draft-wysiwyg').then((mod) => mod.Editor),
  { ssr: false }
)

const WysiwygDescription = ({ title, editorState, setEditorState }: Props) => {
  return (
    <div className='App'>
      <header className='App-header mb-2'>{title}</header>

      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        editorClassName='editor-class'
        toolbarClassName='toolbar-class'
      />
    </div>
  )
}

export default WysiwygDescription
