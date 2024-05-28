'use client'
// CORE LIB
import { LexicalComposer } from '@lexical/react/LexicalComposer'
import { ContentEditable } from '@lexical/react/LexicalContentEditable'
import LexicalErrorBoundary from '@lexical/react/LexicalErrorBoundary'
// PLUGINS
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin'
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin'
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin'
import { ListPlugin } from '@lexical/react/LexicalListPlugin'
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin'
import { CheckListPlugin } from '@lexical/react/LexicalCheckListPlugin'
// NODES
import { HeadingNode } from '@lexical/rich-text'
import { ListNode, ListItemNode } from '@lexical/list'
// COMPONENT
import ToolBarPlugin from './plugins/tool-bar'
import InlineImagePlugin from './plugins/image-plugin'
import { InlineImageNode } from './plugins/image-plugin/image-node'

const theme = {
	heading: {
		h1: 'text-6xl',
		h2: 'text-5xl',
		h3: 'text-4xl',
		h4: 'text-3xl',
		h5: 'text-2xl',
		h6: 'text-xl',
	},
	text: {
		bold: 'font-bold',
		italic: 'italic',
		underline: 'underline underline-offset-1',
		strikethrough: 'line-through',
	},
	// TODO ADD CSS FOR NUMBERED LIST
	list: {
		ul: 'list-disc',
		ol: 'list-decimal',
		bulletlist: 'bulletlist',
		checklist: 'checklist',
		listitem: 'ml-5',
		listitemChecked: 'check',
		listitemUnchecked: 'unchecked',
		nested: {
			listitem: 'nested',
		},
	},
	paragraph: 'relative block',
}

function onError(error: Error) {
	console.error(error)
}

interface EditorProps {
	onChange?: () => void
}

function Editor({ onChange }: EditorProps) {
	const initialConfig = {
		namespace: '',
		theme,
		onError,
		nodes: [HeadingNode, ListNode, ListItemNode, InlineImageNode],
	}

	return (
		<LexicalComposer initialConfig={initialConfig}>
			<ToolBarPlugin />
			<div className="relative w-full h-[300px] mx-auto bg-white">
				<RichTextPlugin
					contentEditable={<ContentEditable className="h-full p-3 border focus-visible:outline-none" />}
					placeholder={<div className="absolute text-gray-700 top-0 left-0 p-3 pointer-events-none">Enter some text...</div>}
					ErrorBoundary={LexicalErrorBoundary}
				/>
				<OnChangePlugin />
				<ListPlugin />
				{/* <CheckListPlugin /> */}
				<HistoryPlugin />
				<AutoFocusPlugin />
				<InlineImagePlugin />
			</div>
		</LexicalComposer>
	)
}
export default Editor
