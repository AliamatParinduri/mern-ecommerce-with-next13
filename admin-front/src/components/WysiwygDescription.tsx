import { Editor } from 'react-draft-wysiwyg'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import '../app/app.css'

type Props = {
  title: string
  editorState: any
  setEditorState: any
}

const WysiwygDescription = ({ title, editorState, setEditorState }: Props) => {
  return (
    <div className='App'>
      <header className='App-header mb-2'>{title}</header>

      <Editor
        editorState={editorState}
        onEditorStateChange={setEditorState}
        // wrapperClassName='wrapper-class'
        editorClassName='editor-class'
        toolbarClassName='toolbar-class'
      />
    </div>
  )
}

export default WysiwygDescription
