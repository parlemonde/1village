import { useRouter } from "next/router";
import React from "react";

import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import ListItem from "@material-ui/core/ListItem";
import List from "@material-ui/core/List";
import Toolbar from "@material-ui/core/Toolbar";
import { createStyles, makeStyles } from "@material-ui/core/styles";
import GroupIcon from "@material-ui/icons/Group";
import InsertChartOutlinedOutlinedIcon from "@material-ui/icons/InsertChartOutlinedOutlined";
import LanguageIcon from "@material-ui/icons/Language";

const drawerWidth = 220;

const useStyles = makeStyles(() =>
  createStyles({
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    drawerContainer: {
      overflow: "auto",
    },
  }),
);

const tabs = ["villages", "users", "stats"];

export const AdminNavigation: React.FC = () => {
  const classes = useStyles();
  const router = useRouter();
  const [selectedTab, setSelectedTab] = React.useState(-1);

  React.useEffect(() => {
    const index = tabs.findIndex((tab) => tab === router.pathname.split("/")[2]);
    setSelectedTab(index);
  }, [router.pathname]);

  const goToPath = (path: string) => () => {
    router.push(path);
  };

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <Toolbar />
      <div className={classes.drawerContainer}>
        <List>
          <ListItem button selected={selectedTab === 0} onClick={goToPath("/admin/villages")}>
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText primary="Villages" />
          </ListItem>
          <ListItem button selected={selectedTab === 1} onClick={goToPath("/admin/users")}>
            <ListItemIcon>
              <GroupIcon />
            </ListItemIcon>
            <ListItemText primary="Utilisateurs" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button selected={selectedTab === 2} onClick={goToPath("/admin/stats")}>
            <ListItemIcon>
              <InsertChartOutlinedOutlinedIcon />
            </ListItemIcon>
            <ListItemText primary="Statistiques" />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};
