// this defines sitesystem context for timers

import React from "react";

const SitesystemContext = React.createContext({
  sitesystem: { sitesystem_timers: [] },
  handleAdd: () => {},
  handleDelete: () => {}
});

export default SitesystemContext;
