import React, { useState } from "react";
import {Box, Button, IconButton, TableCell, TableRow} from "@material-ui/core";
import {format} from "date-fns";
import SyncIcon from "@material-ui/icons/Sync";
import {deepOrange, deepPurple} from "@material-ui/core/colors";
import DeleteIcon from "@material-ui/icons/Delete";

const RepoRow = ({ r, syncRepo, deleteRepo }) => {
  const [loading, setLoading] = useState(false);
  return (
    <TableRow>
      <TableCell>{r.name}</TableCell>
      <TableCell>{r.owner}</TableCell>
      <TableCell>
        <Button variant="outlined" color="primary" href={r.url} target="_blank">
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
          <IconButton
            onClick={async () => {
              setLoading(true);
              await syncRepo(r.id);
              setLoading(false);
            }}
            disabled={loading}
          >
            <SyncIcon style={{ color: !loading && deepPurple[500]}}/>
          </IconButton>
          <IconButton
            onClick={async () => {
              setLoading(true);
              await deleteRepo(r.id);
              setLoading(false);
            }}
            disabled={loading}
          >
            <DeleteIcon style={{ color: !loading && deepOrange[500]}} />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  )
};

export default RepoRow;