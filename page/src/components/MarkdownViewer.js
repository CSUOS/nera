import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import ReactMarkdown from 'react-markdown';
import RemarkMathPlugin from 'remark-math';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import emoji from 'emoji-dictionary';

const MarkdownViewer = props => {
    const newProps = {
        escapeHtml: false,
        plugins: [
            RemarkMathPlugin
        ],

        renderers: {
            text: (props) => props.value.replace(/:[^:\s]*(?:::[^:\s]*)*:/gi, name => emoji.getUnicode(name)),
            break: (props) => <br></br>,
            paragraph: (props) => <p className="markdown_paragraph">{props.children}</p>,
            emphasis: (props) => <em className="markdown_emphasis">{props.children}</em>,
            link: (props) => props.href ? <a className="markdown_link" href={props.href}>{props.children}</a> : <strong className="markdown_strong">(주소가 없는 링크는 만들 수 없습니다.)</strong>,
            linkReference: (props) => props.href ? <a className="markdown_link" href={props.href}>{props.children}</a> : <strong className="markdown_strong">(주소가 없는 링크는 만들 수 없습니다.)</strong>,
            strong: (props) => <strong className="markdown_strong">{props.children}</strong>,
            delete: (props) => <del>{props.children}</del>,
            list: (props) => props.start ? <ol className="markdown_ol">{props.children}</ol> : <ul className="markdown_ul">{props.children}</ul>,
            listItem: (props) => <li className="markdown_list_item">{props.children}</li>,
            blockquote: (props) => (
                <blockquote className="markdown_blockquote">
                    {props.children}
                </blockquote>),
            code: (props) => (
                <pre className="markdown_pre">
                    <code>
                        {props.value}
                    </code>
                </pre>),
            table: (props) => (
                <table className="markdown_table">{props.children}</table>
            ),
            tableCell: (props) => {
                let style = {
                    textAlign: props.align ? props.align : 'center',
                    padding: "6px 13px"
                };

                style.border = '1px solid #dfe2e5';
                if (props.isHeader) {
                    style.background = '#f2f2f2'   
                }

                return <td style={style}>{props.children}</td>
            },
            inlineCode: (props) => <code className="markdown_inline_code">{props.value}</code>,
            math: (props) => <BlockMath>{props.value}</BlockMath>,
            inlineMath: (props) => <InlineMath>{props.value}</InlineMath>,
            html: (props) => <strong className="markdown_strong">(HTML 태그는 사용할 수 없습니다.)</strong>
        }
    };

    return (
        <ReactMarkdown className="markdown_viewer" {...props} {...newProps}></ReactMarkdown>
    );
};

export default MarkdownViewer;