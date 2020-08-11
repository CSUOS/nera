import React from 'react';
import { Grid } from "@material-ui/core";

import PropTypes from 'prop-types';
import classNames from 'classnames';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import OpenInBrowser from '@material-ui/icons/OpenInBrowser'
import green from '@material-ui/core/colors/green';
import grey from '@material-ui/core/colors/grey';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import WarningIcon from '@material-ui/icons/Warning';
import { withStyles } from '@material-ui/core/styles';

const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const styles1 = theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: grey[100],
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
        color: 'black'
    },
});

function MySnackbarContent(props) {
    const { classes, className, message, onClose, variant, onGo, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={classNames(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    <Icon className={classNames(classes.icon, classes.iconVariant)} />
                    {message}
                </span>
            }
            action={[
                <IconButton
                    key="go"
                    aria-label="Go"
                    color="black"
                    className={classes.go}
                    onClick={onGo}
                >
                    <OpenInBrowser className={classes.icon} />
                </IconButton>,
                <IconButton
                    key="close"
                    aria-label="Close"
                    color="black"
                    className={classes.close}
                    onClick={onClose}
                >
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
            {...other}
        />
    );
}

MySnackbarContent.propTypes = {
    classes: PropTypes.object.isRequired,
    className: PropTypes.string,
    message: PropTypes.node,
    onClose: PropTypes.func,
    onGo: PropTypes.func,
    variant: PropTypes.oneOf(['success', 'warning', 'error', 'info']).isRequired,
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

const styles2 = theme => ({
    margin: {
        margin: theme.spacing.unit,
    },
});

class BottomPopup extends React.Component {
    state = {
        open: false,
    };

    // 디버그용
    handleClick = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ open: true });
    }

    handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        this.setState({ open: false });
    };

    handleGo = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        window.location.href = this.props.link;
        this.setState({ open: false });
    };

    render() {
        const { classes } = this.props;

        return (
            <Grid>
                {/* 디버그용 */}
                <Button className={classes.margin} onClick={this.handleClick}>
                    최근 수정한 과제 알림 디버그!
                </Button>
                
                <Snackbar
                    anchorOrigin={{
                        vertical: 'bottom',
                        horizontal: 'right',
                    }}
                    open={this.state.open}
                    onClose={this.handleClose}
                >
                    <MySnackbarContentWrapper
                        onClose={this.handleClose}
                        onGo={this.handleGo}
                        variant="info"
                        message="남은 과제하러 오셨나요? 최근에 수정한 과제가 있습니다."
                    />
                </Snackbar>
            </Grid>
        );
    }
}

BottomPopup.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles2)(BottomPopup);