import React from 'react';
import { Grid, CircularProgress } from '@material-ui/core';

type Props = {
	status : string
}

// 콘텐츠가 아직 업로드되지 않았을 때 표시하는 로딩 컴포넌트
const Loading = ({status} : Props) =>
	<Grid container className="loading_contents" direction="column" alignItems="center" >
		<CircularProgress className="loading" size="6rem" />
		<span style={{margin:20}}>{status}</span>
	</Grid>;

export default Loading;