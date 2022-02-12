import regTag from "../actions/regTag";

const mpTag = (config) => {
  regTag(config.store)({
    init: ()=>{
        console.warn("init");
    },
    action: ()=>{
        console.log("action");
    },
    impression: ()=>{
        console.log("impression");
    }
  });
};

export default mpTag;
