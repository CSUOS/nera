
<Modal
open={sOpen}
onClose={listHandleClose}
aria-labelledby="add student list to assignment"
aria-describedby="add student list to assignment"
className="modal">
<Paper className="modal_con">
    <Grid container spacing={2} wrap="wrap" className="modal_form">
        <Grid container item  xs={12}>
            <Button onClick={getStudentList}>수강생 목록 불러오기</Button>
            {renderStudentList()}
            <Button className="save_button" onClick={saveStudentList}>저장</Button>
        </Grid>
        
        <Grid container item className="student_box_con">
            {
                renderStudent.map((student, index)=>
                    <Grid container item className="student_box" wrap="nowrap" alignItems="center">
                        <TextField  label={"학생"+(index+1)} 
                            rows={1}
                            onInput={(e)=>changeStudentField(e, index)} 
                            className="popup_student"
                            value={student}
                            error={typeof(student)==="string"?true:false}
                            helperText="숫자를 입력해주세요."
                            >
                        </TextField>
                        <Grid item className="box_xbtn"><Button onClick={()=>deleteStudent(index)}><ClearIcon/></Button></Grid>
                    </Grid>
                )
            }
            <Paper className="add_button">
                <Button onClick={addStudent}>
                    <Typography>수강생 추가</Typography>
                </Button>
            </Paper>
        </Grid>
    </Grid>
</Paper>
</Modal>


<Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description"
    className="modal">
    <Paper className="modal_con">
        <Grid container>
            <Grid container item alignItems="center">
                <TextField label="목록 이름" required onInput={changeListName} rows={1} className="modal_input_field" value={listName}></TextField>
                <Button className="save_button" onClick={()=>saveModalGroup()}>저장</Button>
            </Grid>
            <Grid container item alignItems="center" wrap="wrap">
                {
                    students.map((student, index)=>
                        <Grid item xs="3">
                            <TextField  label={"학생"+(index+1)} 
                                        rows={1}
                                        onInput={(e)=>changeListStudent(e, index)} 
                                        className={"modal_students modal_input_field"}
                                        id={"modal_student"+index} 
                                        value={student}
                                        error={typeof(student)==="string"?true:false}
                                        helperText="숫자를 입력해주세요."
                                        >
                            </TextField>
                        </Grid>
                    )
                    
                }
                <Button className="add_button" onClick={addStudent}>학생 추가</Button>
            </Grid>
        </Grid>
    </Paper>
</Modal>