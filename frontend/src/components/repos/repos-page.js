import React, {useEffect, useState} from 'react';
import {compose} from "redux";
import {connect} from "react-redux";
import {logout} from "../../redux/actions";
import {Box, Paper, Avatar, Typography, CircularProgress, TextField, Button} from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import { deepOrange } from '@material-ui/core/colors';
import {createRepo, deleteRepo, getRepos, syncRepo} from "../../redux/api";
import ReposTable from "./repos-table";
import ColoredTextField from "../elements";

const isWordWithoutSpecialSymbols = (word = '') => {
  const re = /^[a-zA-Z0-9\-]+$/;
  return re.test(word);
};

const useStyles = makeStyles((theme) => ({
  largeAvatar: {
    width: theme.spacing(7),
    height: theme.spacing(7),
    backgroundColor: deepOrange[500]
  },
}));

const ReposPage = ({auth, logout}) => {
  const {user, token} = auth;
  const [loading, setLoading] = useState(true);
  const [repos, setRepos] = useState([]);
  const [error, setError] = useState('');
  const [repoInfo, setRepoInfo] = useState('');
  const [repoLoading, setRepoLoading] = useState(false);
  useEffect(() => {
    (async() => {
      try{
        const repositories = await getRepos(token);
        setRepos(repositories)
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false)
      }
    })()
  }, []);

  const deleteRepository = async(id) => {
    try{
      await deleteRepo(id, token);
      setRepos(repos.filter(r => r.id !== id));
    } catch (e) {
      console.log(e)
    }
  };
  const syncRepository = async(id) => {
    try{
      const updatedRepo = await syncRepo(id, token);
      setRepos(repos.map(r => r.id === id ? updatedRepo : r));
    } catch (e) {
      console.log(e)
    }
  };
  const addRepo = async() => {
    if(repoInfo === '') {
      setError('Required');
      return;
    }
    const repoInfoParts = repoInfo.split('/');
    if (repoInfoParts.length !== 2) {
      setError('Invalid ropository link');
      return;
    }
    const trimmedRepoInfoParts = repoInfoParts.map(r => r.trim());
    const [ownerName, repoName] = trimmedRepoInfoParts;
    if(!isWordWithoutSpecialSymbols(ownerName)) {
      setError(`${ownerName} is not correct owner name`);
      return;
    }
    if(!isWordWithoutSpecialSymbols(repoName)) {
      setError(`${repoName} is not correct repository name`);
      return;
    }

    try {
      setRepoLoading(true);
      const repo = await createRepo(ownerName, repoName, token);
      setRepos(savedRepos => [repo, ...savedRepos]);
      setRepoInfo('');
      setError('');
    } catch (e) {
      setError('Repository does not exist')
    } finally {
      setRepoLoading(false);
    }
  };

  const {email} = user;
  const classes = useStyles();
  return (
    <Box
      width="100%"
      height="100%"
      display="flex"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
    >
      <Box
        width="100%"
        height="80px"
        display="flex"
        alignItems="center"
        component={Paper}
        elevation={3}
        paddingLeft="20px"
        paddingRight="20px"
        justifyContent="space-between"
      >
        <Box
          display="flex"
          alignItems="center"
        >
          <Avatar className={classes.largeAvatar}>{email[0]}</Avatar>
          <Box paddingLeft="20px">
            <Typography variant="h5">{email}</Typography>
          </Box>
        </Box>
        <Button
          variant="outlined"
          onClick={logout}
        >
          Logout
        </Button>
      </Box>
      <Box
        marginTop="50px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        width="80%"
      >
        {
          loading ? (<CircularProgress />) :
            repos.length === 0 ?
              (<Typography variant="h5">You have not added repositories yet</Typography>) :
              (<ReposTable repos={repos} deleteRepo={deleteRepository} syncRepo={syncRepository}/>)
        }

      </Box>
      <Box
        marginTop="50px"
        width="100%"
        display="flex"
        alignItems="center"
        justifyContent="center"
        padding="25px"
      >
          <Box width="80%">
            <ColoredTextField
              fullWidth
              helperText={error}
              error={Boolean(error)}
              placeholder="Type: repositoryOwner/repositoryName"
              label="Repository link"
              variant="outlined"
              value={repoInfo}
              onChange={(e) => setRepoInfo(e.target.value)}
              disabled={repoLoading}
            />
          </Box>
          <Box
            component={Button}
            width="100px"
            variant="outlined"
            onClick={addRepo}
            marginLeft="25px"
            disabled={repoLoading}
          >
            Create
          </Box>

      </Box>
    </Box>
  )
};

const mapStateToProps = ({ auth}) => ({
  auth,
});

export default compose(
  connect(mapStateToProps, {logout})
)(ReposPage);
