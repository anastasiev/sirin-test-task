import React from 'react';
import { format } from 'date-fns';
import DeleteIcon from '@material-ui/icons/Delete';
import SyncIcon from '@material-ui/icons/Sync';

import {Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Button} from "@material-ui/core";
import {deepOrange, deepPurple} from "@material-ui/core/colors";
import RepoRow from "./repo-row";

const ReposTable = ({repos, deleteRepo, syncRepo}) => {
  return (
    <Box
      component={Paper}
      elevation={3}
      padding="25px"
      width="100%"
    >
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Owner</TableCell>
            <TableCell>Link</TableCell>
            <TableCell>Stars</TableCell>
            <TableCell>Forks</TableCell>
            <TableCell>issues</TableCell>
            <TableCell>Created date</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            repos.map(r => (
              <RepoRow
                key={r.id}
                r={r}
                deleteRepo={deleteRepo}
                syncRepo={syncRepo}
              />
            ))
          }
        </TableBody>

      </Table>
    </Box>

  )
};

export default ReposTable;