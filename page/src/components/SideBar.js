import React from 'react';
import {Link} from 'react-router-dom';
import "./components.css";
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
import { Divider, ListSubheader } from '@material-ui/core';

import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import IconButton from '@material-ui/core/IconButton';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import List from '@material-ui/core/List';
import ExpandLess from "@material-ui/icons/ExpandLess";
import ExpandMore from "@material-ui/icons/ExpandMore";
import Collapse from "@material-ui/core/Collapse";
import LibraryBooksIcon from '@material-ui/icons/LibraryBooks';
import StarBorder from "@material-ui/icons/StarBorder";
import StarHalfIcon from '@material-ui/icons/StarHalf';
import StarIcon from '@material-ui/icons/Star';

const useStyles = makeStyles((theme) => ({
    nested:{
        paddingLeft: theme.spacing(4)
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      justifyContent: 'flex-end',
    }
  }));
  
const SideBar = (props) => {
    const classes = useStyles();
    const {type, drawerClose, assignment_info} = props;
    const [down, setDown] = React.useState(true);

    const handleMenuDown = () => {
        setDown(!down);
      };

    return (
        <div className="side_bar">
            <div className={clsx(classes.drawerHeader,"sideBar_header")}>
                <Link to="/home"><div className="NERA"><a href="#"><h1>NERA</h1></a></div></Link>
                <IconButton onClick={drawerClose}>
                    <ChevronLeftIcon />
                </IconButton>
            </div>
            <Divider />

            <List
                subheader={
                    <ListSubheader component="div" id="subheader">
                        {type===1? "내 과제" : "출제한 과제"}    
                    </ListSubheader>
                }
            >
                {
                    assignment_info.map((as) => 
                        <Link to={'/home/assignment/'+as[0]}>
                            <ListItem button className={classes.nested}>
                            <ListItemIcon>
                                {// 수정해야함
                                type===0?
                                    (as[2]===0?<StarBorder/>:
                                        (as[2]===1?<StarHalfIcon/>:<StarIcon/>)
                                    )
                                    :(as[2]==0?<StarBorder />: <StarIcon/>)}
                            </ListItemIcon>
                            <ListItemText primary={as[1]} />
                            </ListItem>
                        </Link>
                    )
                }
            </List>
            
            {type === 0 ?
            <List
            subheader={
                <ListSubheader component="div" id="subheader">관리</ListSubheader>
            }
            >
                <Link to='/home/setting'>
                    <ListItem button className={classes.nested}>
                        <ListItemText primary="과제 관리" />
                    </ListItem>
                </Link>
                <Link to='/home/setting'>
                {// 여기는 회원 정보 관리로 수정해야함
                }
                    <ListItem button className={classes.nested}>
                        <ListItemText primary="회원 정보 관리" />
                    </ListItem>
                </Link>
            </List> : undefined}
        </div>
    );
}
export default SideBar