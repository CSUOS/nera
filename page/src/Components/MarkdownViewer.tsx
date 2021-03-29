import React from 'react';
import ReactMarkdown from 'react-markdown';
import RemarkMathPlugin from 'remark-math';
import { BlockMath, InlineMath } from "react-katex";
import * as emoji from "emoji-dictionary";
import remarkGfm from "remark-gfm";
import 'katex/dist/katex.min.css';

interface Props {
    source: string;
}

const MarkdownViewer: React.FC<Props & React.HTMLAttributes<HTMLDivElement>> = (props: Props) => {
	// 각 HTML 컴포넌트를 어떻게 렌더링할 것인지를 정의.
	// react-markdown 라이브러리에서 매개변수에 대한 타입을 제공하지 않으므로,
	// 매개변수의 타입을 any로 통일하였음.
	
	function insertUnicode(props: any) {
		return props.value.replace(/:[^:\s]*(?:::[^:\s]*)*:/gi, (name: string) => emoji.getUnicode(name));
	}

	function renderBreak() {
		return <br/>;
	}

	function renderParagraph(props: any) {
		return <p className="markdown_paragraph">{props.children}</p>;
	}

	function renderEmphasis(props: any) {
		return <em className="markdown_emphasis">{props.children}</em>;
	}

	function renderLink(props: any) {
		if (props.href) {
			return <a className="markdown_link" href={props.href}>{props.children}</a>;
		} else {
			return <strong className="markdown_strong">(주소가 없는 링크는 만들 수 없습니다.)</strong>;
		}
	}

	function renderStrong(props: any) {
		return <strong className="markdown_strong">{props.children}</strong>;
	}

	function renderDelete(props: any) {
		return <del>{props.children}</del>;
	}

	function renderList(props: any) {
		if (props.start) {
			return <ol className="markdown_ol">{props.children}</ol>;
		} else {
			return <ul className="markdown_ul">{props.children}</ul>;
		}
	}

	function renderListItem(props: any) {
		return <li className="markdown_list_item">{props.children}</li>;
	}

	function renderBlockQuote(props: any) {
		return <blockquote className="markdown_blockquote">{props.children}</blockquote>;
	}

	function renderCode(props: any) {
		return (
			<pre className="markdown_pre">
				<code>
					{props.value}
				</code>
			</pre>
		)
	}

	function renderTable(props: any) {
		return <table className="markdown_table">{props.children}</table>;
	}

	function renderTableCell(props: any) {
		const style: any = {
			textAlign: props.align ? props.align : 'center',
			padding: "6px 13px"
		};

		style.border = '1px solid #dfe2e5';
		if (props.isHeader) {
			style.background = '#f2f2f2';
		}

		return <td style={style}>{props.children}</td>;
	}

	function renderInlineCode(props: any) {
		return <code className="markdown_inline_code">{props.value}</code>;
	}

	function renderMath(props: any) {
		return <BlockMath>{props.value}</BlockMath>;
	}

	function renderInlineMath(props: any) {
		return <InlineMath>{props.value}</InlineMath>;
	}

	function renderHTML() {
		// 외부 콘텐츠를 사용하지 못하게 함.
		return <strong className="markdown_strong">(HTML 태그는 사용할 수 없습니다.)</strong>
	}

	const newProps = {
		escapeHtml: false,
		plugins: [
			RemarkMathPlugin,
			remarkGfm // Table 지원
		],

		renderers: {
			/* 각 element에 대한 렌더링 방식을 정의할 것. */
			/* 아래에서 정의하지 않은 element는 ReactMarkdown의 기본 방식을 따름. */
			text: insertUnicode,
			break: renderBreak,
			paragraph: renderParagraph,
			emphasis: renderEmphasis,
			link: renderLink,
			linkReference: renderLink,
			strong: renderStrong,
			delete: renderDelete,
			list: renderList,
			listItem: renderListItem,
			blockquote: renderBlockQuote,
			code: renderCode,
			table: renderTable,
			tableCell: renderTableCell,
			inlineCode: renderInlineCode,
			math: renderMath,
			inlineMath: renderInlineMath,
			html: renderHTML
		}
	};

	return (
		<ReactMarkdown className="markdown_viewer" {...props} {...newProps} />
	);
};

export default MarkdownViewer;