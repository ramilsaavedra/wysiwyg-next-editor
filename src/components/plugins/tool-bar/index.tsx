import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import Heading from './heading'
import UndoRedo from './undo-redo'

function ToolBarPlugin() {
	const [editor] = useLexicalComposerContext()
	return (
		<div className="w-[50%] mx-auto flex">
			<UndoRedo editor={editor} />
			<Heading editor={editor} />
		</div>
	)
}

export default ToolBarPlugin
