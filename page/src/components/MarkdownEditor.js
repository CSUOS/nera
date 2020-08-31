import React, { useEffect, useState, useRef, createRef, useReducer } from 'react';
import { Paper, Grid, Typography, Divider, TextField, FilledInput } from '@material-ui/core';
import MarkdownViewer from './MarkdownViewer';
import AceEditor from 'react-ace';

import "ace-builds/src-noconflict/mode-markdown";
import "ace-builds/src-noconflict/mode-latex";
import "ace-builds/src-noconflict/theme-github";
import "ace-builds/src-noconflict/ext-language_tools";

class MarkDownWithLaTeXRules
    extends window.ace.acequire("ace/mode/markdown_highlight_rules").MarkdownHighlightRules {
    constructor() {
        super();
        //console.log(this.$rules)
        let LatexHighlightRules = window.ace.acequire("ace/mode/latex_highlight_rules").LatexHighlightRules;
        let latexRules = (new LatexHighlightRules()).getRules();
        //console.log(latexRules);

        this.$rules.start.push({
            token: "keyword",
            regex: "\\$\\$",
            next: "latex-start"
        });
        this.$rules.start.push({
            token: "keyword",
            regex: "\\$",
            next: "latex-start"
        });
        
        this.embedRules(latexRules, "latex-", [
            {
                token: "keyword",
                regex: "\\$\\$",
                next: "start"
            },
            {
                token: "keyword",
                regex: "\\$",
                next: "start"
            }
        ]);

    }
}

class CustomMarkdownMode
    extends window.ace.acequire("ace/mode/markdown").Mode {
    constructor() {
        super();
        this.HighlightRules = MarkDownWithLaTeXRules;
    }
}

const MarkdownEditor = (props) => {
    const [source, setSource] = useState(undefined);
    const [timer, setTimer] = useState(undefined);
    const editorRef = useRef();
    const viewerRef = useRef();

    function updateSource() {
        if (editorRef.current) {
            let session = editorRef.current.editor.getSession();
            setSource(session.getValue());
        } else clearInterval(timer);
    }

    useEffect(() => {
        const customMarkDown = new CustomMarkdownMode();
        let session = editorRef.current.editor.getSession();
        session.setMode(customMarkDown);
        setTimer(setInterval(updateSource, 250));
    }, []);

    useEffect(() => {
        setSource(props.contents === undefined ? "" : props.contents);
        let session = editorRef.current.editor.getSession();
        session.setValue(props.contents === undefined ? "" : props.contents);
    }, [props.contents]);

    function handleTextChange(value) {
        if (props.onChange)
            props.onChange(value);
    }

    return (
        <Paper component="form" className="editor_root">
            <Grid container direction="row" justify="center">
                <div className="editor_input_container">
                    <Typography variant="caption">Markdown 및 LaTeX 형식</Typography>
                    <Divider className="editor_caption_divider" orientation="horizontal"></Divider>
                    <div className="editor_input">
                        <AceEditor
                            ref={editorRef}
                            className="editor_input"
                            mode="markdown"
                            theme="textmate"
                            fontSize={14}
                            showPrintMargin={false}
                            minLines={40}
                            maxLines={40}
                            showGutter={true}
                            highlightActiveLine={true}
                            wrapEnabled={true}
                            onChange={handleTextChange}
                        ></AceEditor>
                    </div>
                </div>
                <Divider className="editor_divider" orientation="vertical" flexItem></Divider>
                <div className="editor_viewer_container">
                    <Typography variant="caption">미리 보기</Typography>
                    <Divider className="editor_caption_divider" orientation="horizontal"></Divider>
                    <div ref={viewerRef} className="editor_viewer">
                        <MarkdownViewer source={source}/>
                    </div>
                </div>
            </Grid>
        </Paper>
    );
};

export default MarkdownEditor;