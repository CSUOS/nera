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
    const {drawerClose, name, number} = props;
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
                <ListSubheader component="div" id="subheader">내 강의</ListSubheader>
            }
            >
                <Link to="/lecture/1">
                    <ListItem button>
                        <ListItemIcon>
                        <LibraryBooksIcon />
                        </ListItemIcon>
                        <ListItemText primary="이산수학" />
                    </ListItem>
                </Link>

                <Link to="/lecture/2">
                    <ListItem button onClick={handleMenuDown}>
                        <ListItemIcon>
                        <LibraryBooksIcon />
                        </ListItemIcon>
                        <ListItemText primary="선형대수" />
                        {down ? <ExpandLess /> : <ExpandMore />}
                    </ListItem>
                </Link>

                <Collapse in={down} timeout="auto" unmountOnExit>
                    <List component="div" disablePadding>
                        <Link to="/lecture/2/assignment/1">
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                <StarBorder />
                                </ListItemIcon>
                                <ListItemText primary="과제 #1" />
                            </ListItem>
                        </Link>
                        <Link to="/lecture/2/assignment/2">
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                <StarHalfIcon/>
                                </ListItemIcon>
                                <ListItemText primary="과제 #2" />
                            </ListItem>
                        </Link>
                        <Link to="/lecture/2/assignment/3">
                            <ListItem button className={classes.nested}>
                                <ListItemIcon>
                                <StarHalfIcon/>
                                </ListItemIcon>
                                <ListItemText primary="과제 #3" />
                            </ListItem>
                        </Link>
                    </List>
                </Collapse>

            </List>
        </div>
    );
}
export default SideBar