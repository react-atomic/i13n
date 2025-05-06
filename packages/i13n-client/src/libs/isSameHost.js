export const isSameHost =
  (/**@type string*/ hostName) => (/**@type string*/ test) => {
    const thisHost = "//" + hostName;
    const i = test.indexOf(thisHost);
    if (5 === i || 6 === i) {
      const check = test.charAt(i + thisHost.length);
      if ("/" === check || "?" === check || "" === check || ":" === check) {
        return true;
      }
    }
    return false;
  };
