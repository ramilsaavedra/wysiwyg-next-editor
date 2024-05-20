import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'
import { $createTextNode, $getRoot, $getSelection } from 'lexical'
import { $createHeadingNode } from '@lexical/rich-text'
import { $setBlocksType } from '@lexical/selection'

function Heading() {
	const [editor] = useLexicalComposerContext()
	const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
		editor.update(() => {
			const selection = $getSelection()
			$setBlocksType(selection, () => $createHeadingNode('h1'))
		})
	}

	return <button onClick={onClick}>Heading</button>
}

export default Heading
