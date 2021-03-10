import React, { useEffect, useState, createRef } from 'react';

import { Grid, Toolbar } from "@material-ui/core";

import { Header, SideBar } from '.';
import { useUserState } from '../Main/Model/UserModel';

const Layout: React.FC = ({ children }) => {
	const [open, useOpen] = useState<boolean>(true);

	const user = useUserState();
	const mobileRef = createRef<HTMLDivElement>();

	useEffect(() => {
		// routing 변경 시마다 open 해지 => 모바일 떄문에
		if (mobileRef.current && mobileRef.current.offsetWidth < 768) {
			// 모바일이면 페이지 이동 시마다 sidebar 닫기
			useOpen(false);
		}
	}, [window.location.href]);

	return (
		<Grid id="page-con">
			<div className="mobile-check" ref={mobileRef} />
			{
				user &&
					<>
						<SideBar
							classes={open ? "open-sidebar" : "close-sidebar"}
							useOpen={useOpen}
							userType={user.type}
						/>
						<Grid id="wrap">
							<Header
								open={open}
								useOpen={useOpen}
								userName={user.userName}
								userType={user.type}
							/>
							<Toolbar className="back-margin" />
							<Grid className="content-wrap">
								{children}
							</Grid>
						</Grid>
					</>
			}
		</Grid>
	);
};

export default Layout;