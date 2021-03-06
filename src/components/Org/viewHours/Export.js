import { useEffect, useState } from 'react';
import { Grid, Menu, MenuItem, Switch, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@material-ui/core';
import { Assignment as CopyIcon, Done as DoneIcon, GetApp as DownloadIcon, KeyboardArrowDown as OpenMenuIcon, KeyboardTab as TabIcon } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import dayjs from 'dayjs';

const delimeters = { comma: ',', tab: '\t', semicolon: ';' };
const extensions = { comma: 'csv', tab: 'tsv', semicolon: 'txt' };

const useStyles = makeStyles({
    textarea: {
        width: '100%',
        minHeight: 250
    },
    switch: {
        marginTop: -2
    }
});

const DelimeterIcon = ({ del }) => {
    switch (del) {
        case 'comma': return ',';
        case 'tab': return <TabIcon />;
        case 'semicolon': return ';';
    }
};

const DelimeterMenu = props => {
    const [anchorEl, setAnchorEl] = useState(null);

    const handleClick = event => setAnchorEl(event.currentTarget);
    const close = () => setAnchorEl(null);

    const setDelimeter = del => {
        props.setDelimeter(del);
        close();
    };

    return (
        <>
            <Button variant='outlined' startIcon={<DelimeterIcon del={props.delimeter} />} endIcon={<OpenMenuIcon />} onClick={handleClick}>
                {props.delimeter}
            </Button>
            <Menu
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={close}
            >
                <MenuItem onClick={() => setDelimeter('comma')}>Comma</MenuItem>
                <MenuItem onClick={() => setDelimeter('tab')}>Tab</MenuItem>
                <MenuItem onClick={() => setDelimeter('semicolon')}>Semicolon</MenuItem>
            </Menu>
        </>
    );
};

const Export = props => {

    const [csv, setCsv] = useState('');
    const [copied, setCopied] = useState(false);
    const [delimeter, setDelimeter] = useState('comma');
    const [allMembers, setAllMembers] = useState(false);

    const close = () => props.setOpen(false);

    const download = () => {
        const extension = extensions[delimeter];
        const encodedUri = encodeURI(csv);
        const link = document.createElement('a');
        link.setAttribute('href', `data:text/${delimeter === 'semicolon' ? 'plain' : extension},${encodedUri}`);
        link.setAttribute('download', `hour-logs.${extension}`);
        document.body.appendChild(link); // Required for FF
        link.click();
        link.remove();
    };

    const generateCsv = () => {
        const del = delimeters[delimeter];
        let str = `Hours${del}Approver${del}Start Time${del}End Time${del}Activity Description`;
        props.logs.forEach(log => {
            if (log.status === 'approved' && (allMembers || log.userId === props.userId)) {
                const start = dayjs(log.start).format('YYYY-MM-DD HH:MM');
                const end = dayjs(log.end).format('YYYY-MM-DD HH:MM');
                str += `\n${log.hours}${del}${log.approverInfo.firstName.replaceAll(del, '')} ${log.approverInfo.lastName.replaceAll(del, '')}${del}${start}${del}${end}${del}${log.description}`;
            }
        });
        return str;
    };

    useEffect(() => {
        setCsv(generateCsv());
        setCopied(false);
    }, [delimeter, allMembers, props.logs]);

    const classes = useStyles();
    return (
        <Dialog open={props.open} onClose={close} fullWidth maxWidth='md'>
            <DialogTitle>Export Hours</DialogTitle>
            <DialogContent>
                <DialogContentText>
                    These are your hour logs for <strong>{props.org.name}</strong> in a {delimeter}-separated format, which can be imported into most spreadsheet programs. The logs are sorted with most recent hours first.
                </DialogContentText>
                <Grid container justify='center' spacing={1}>
                    <Grid container item xs={12} justify='center' direction='vertical' spacing={3}>
                        <Grid item>
                            <DelimeterMenu delimeter={delimeter} setDelimeter={setDelimeter} />
                        </Grid>
                        <Grid item>
                            {
                                navigator.clipboard !== undefined &&
                                <Button onClick={() => navigator.clipboard.writeText(csv).then(() => setCopied(true))} variant='outlined' startIcon={copied ? <DoneIcon /> : <CopyIcon />}>
                                    Copy
                                </Button>
                            }
                        </Grid>
                        <Grid item>
                            <Button variant='outlined' onClick={download} startIcon={<DownloadIcon />}>
                                Download
                            </Button>
                        </Grid>
                    </Grid>
                    {
                        props.org.role !== 'vol' &&
                        <Grid item xs={12} align='center'>
                            Show All Members
                            <Switch
                                checked={allMembers}
                                onChange={() => setAllMembers(!allMembers)}
                                color='primary'
                                className={classes.switch}
                            />
                        </Grid>
                    }
                    <Grid item xs={11} align='center'>
                        <textarea readOnly value={csv} className={classes.textarea} />
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='primary' onClick={close}>
                    Done
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default Export;