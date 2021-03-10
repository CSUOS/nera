import React, { ReactNode } from 'react';
import clsx from 'clsx';

import { Grid, SvgIcon, Typography } from '@material-ui/core';

import { isStringBlank } from '../utils/checkString';

type Props = {
	className?: string; 
	icon: string;
	mainTitle: string;
	subTitle?: string;
	information?: ReactNode;
	rightSide?: ReactNode;
}

const PageInfo: React.FunctionComponent<Props> = ({className, icon, mainTitle, subTitle, information, rightSide}) => (
	<Grid className={clsx("page-info", className)}>
		<Grid className="page-info-con">
			<Grid className="page-title-con">
				<Typography className="icon" variant="h2">{icon}</Typography>
				<Grid className="title">
					<Typography variant="h3">{mainTitle}</Typography>
					<Typography variant="h6">{subTitle}</Typography>
				</Grid>
			</Grid>
			{
				rightSide &&
				<Grid className="right-side">
					{rightSide}
				</Grid>
			}
		</Grid>
		{information && <Grid item className="page-information">{information}</Grid>}
	</Grid>
)

export default PageInfo;