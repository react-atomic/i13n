const mergeGaLabel = (label, more) => {
    let thisLabel = label;
    if (keys(more || {}).length) {
      if (OBJECT !== typeof thisLabel) {
        thisLabel = {
          label,
          ...more,
        };
      } else {
        thisLabel = { ...thisLabel, ...more };
      }
    }
    if (OBJECT === typeof thisLabel) {
      thisLabel = JSON.stringify(thisLabel);
    }
    return thisLabel;
};

export { mergeGaLabel };
