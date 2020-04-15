import React from 'react';
import { format } from 'date-fns';
import DeleteIcon from '@material-ui/icons/Delete';
import SyncIcon from '@material-ui/icons/Sync';

import {Box, Paper, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Button} from "@material-ui/core";

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
              <TableRow key={r.id}>
                <TableCell>{r.name}</TableCell>
                <TableCell>{r.owner}</TableCell>
                <TableCell>
                  <Button variant="outlined" color="primary" href={r.url}>
                    Link
                  </Button>
                </TableCell>
                <TableCell>{r.stars}</TableCell>
                <TableCell>{r.forks}</TableCell>
                <TableCell>{r.issues}</TableCell>
                <TableCell>{format(new Date(r.created).getTime(), 'dd/MM/yyyy')}</TableCell>
                <TableCell>
                  <Box
                    width="80px"
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <IconButton onClick={() => syncRepo(r.id)}>
                      <SyncIcon />
                    </IconButton>
                    <IconButton onClick={() => deleteRepo(r.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </TableCell>
              </TableRow>
            ))
          }
        </TableBody>

      </Table>
    </Box>

  )
};

export default ReposTable;