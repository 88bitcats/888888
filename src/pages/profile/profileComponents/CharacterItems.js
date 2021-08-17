import React, { useEffect, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { getItemDetails, getUserItems } from "../../../actions/itemActions";
import Loader from "../../../components/Loader";
import SingleCharacterItem from "./SingleCharacterItem";
import { IconButton } from "@material-ui/core";
import {
  ArrowLeft,
  KeyboardArrowLeft,
  KeyboardArrowRight,
} from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  background: {
    minWidth: 200,
    [theme.breakpoints.down("sm")]: {
      minWidth: 100,
    },
  },
  sectionWrapper: { paddingRight: 20 },
  scroll: {
    height: 440,
    overflowY: "scroll",

    [theme.breakpoints.down("sm")]: {
      height: 300,
    },
  },
  title: {
    fontSize: 26,
    width: "fit-content",
    paddingBottom: 10,
    paddingTop: 10,
    color: "white",
    fontWeight: 800,
    fontFamily: "Montserrat",
    margin: 0,
    padding: 0,
    [theme.breakpoints.down("sm")]: {
      fontSize: 18,
    },
  },
  subtitle: {
    fontSize: 18,
    width: "fit-content",
    paddingTop: 10,
    paddingBottom: 10,
    color: "white",
    fontWeight: 600,
    fontFamily: "Montserrat",
    margin: 0,
    padding: 0,
    [theme.breakpoints.down("sm")]: {
      fontSize: 16,
    },
  },
  notFound: {
    fontSize: 14,
    width: "fit-content",
    paddingBottom: 10,
    paddingTop: 10,
    color: "white",
    fontWeight: 500,
    fontFamily: "Montserrat",
    margin: 0,
    padding: 0,
    [theme.breakpoints.down("sm")]: {
      fontSize: 14,
    },
  },
}));

function CharacterItems({
  getUserItems,
  getItemDetails,
  useritems,
  character,
  characterProperties,
  setCharacterProperties,
}) {
  const classes = useStyles();

  const [actualCase, setActualCase] = useState(0);

  const [validItems, setValidItems] = useState({
    weapon: [],
    armor: [],
    mount: [],
    helmet: [],
    wing: [],
  });
  const [clickIndex, setClickIndex] = useState({
    weapon: -1,
    armor: -1,
    mount: -1,
    helmet: -1,
    wing: -1,
  });
  const [clickValues, setClickValues] = useState({
    weapon: 0,
    armor: 0,
    mount: 0,
    helmet: 0,
    wing: 0,
  });

  useEffect(() => {
    async function asyncFn() {
      await getUserItems();
    }
    asyncFn();
  }, []);

  useEffect(() => {
    async function asyncFn() {
      // 1. Fetching character level
      let characterLevel = parseInt(character.level);

      let weapons = [];
      let armors = [];
      let mount = [];
      let helmets = [];
      let wings = [];

      if (useritems !== null && useritems !== undefined) {
        if (useritems.length === 0) {
          setActualCase(1);
        } else {
          useritems.map(async (element) => {
            let item = await getItemDetails(element.itemId);

            //2. Checking compatible character items
            if (
              (item.forCharacter === character.name &&
                parseInt(item.level) === 2 &&
                characterLevel >= 11 &&
                characterLevel <= 29) ||
              (item.forCharacter === character.name &&
                parseInt(item.level) === 1 &&
                characterLevel >= 0 &&
                characterLevel <= 10)
            ) {
              // 3. Distributing items into category
              if (
                item.category === "sword" ||
                item.category === "big knife" ||
                item.category === "tessen" ||
                item.category === "bow & arrow" ||
                item.category === "gun" ||
                item.category === "sceptre" ||
                item.category === "magic vase"
              ) {
                weapons = [...weapons, item];
              }
              if (item.category === "helmet") {
                helmets = [...helmets, item];
              }
              if (item.category === "wing") {
                wings = [...wings, item];
              }
              if (item.category === "armor") {
                armors = [...armors, item];
              }
              if (item.category === "mount") {
                mount = [...mount, item];
              }
              setValidItems({
                weapon: weapons,
                armor: armors,
                mount: mount,
                helmet: helmets,
                wing: wings,
              });
            }
          });

          setActualCase(2);
        }
      } else {
        setActualCase(0);
      }
    }
    asyncFn();
  }, [useritems]);

  const updateCharacterProperties = (index, category) => {
    // 1. Fetching clicked item property
    let selectedItemProperties = validItems[category][index].properties;

    // 3. updating clicked item values
    let tempClickValues = clickValues;
    tempClickValues[category] = selectedItemProperties;
    setClickValues(tempClickValues);

    if (clickIndex[category] === index) {
      let tempObject = {
        xp:
          characterProperties.xp -
          (selectedItemProperties.xp ? selectedItemProperties.xp : 0),
        hp:
          characterProperties.hp -
          (selectedItemProperties.hp ? selectedItemProperties.hp : 0),
        mp:
          characterProperties.mp -
          (selectedItemProperties.mp ? selectedItemProperties.mp : 0),
        Patk:
          characterProperties.Patk -
          (selectedItemProperties.bDam ? selectedItemProperties.bDam : 0),
        Pdef:
          characterProperties.Pdef -
          (selectedItemProperties.prot ? selectedItemProperties.prot : 0),
        speed:
          characterProperties.speed -
          (selectedItemProperties.speed ? selectedItemProperties.speed : 0),
        accuracy:
          characterProperties.accuracy -
          (selectedItemProperties.accuracy
            ? selectedItemProperties.accuracy
            : 0),
      };
      setCharacterProperties(tempObject);

      // 2. Updating clicked item index
      let tempClickIndex = clickIndex;
      tempClickIndex[category] = -1;
      setClickIndex(tempClickIndex);
    } else {
      let oldXp = 0;
      let oldHp = 0;
      let oldMp = 0;
      let oldPatk = 0;
      let oldPdef = 0;
      let oldSpeed = 0;
      let oldAccuracy = 0;

      if (
        validItems[category][clickIndex[category]] !== undefined &&
        validItems[category][clickIndex[category]] !== null
      ) {
        oldXp = validItems[category][clickIndex[category]].properties.xp
          ? validItems[category][clickIndex[category]].properties.xp
          : 0;
        oldHp = validItems[category][clickIndex[category]].properties.hp
          ? validItems[category][clickIndex[category]].properties.hp
          : 0;
        oldMp = validItems[category][clickIndex[category]].properties.mp
          ? validItems[category][clickIndex[category]].properties.mp
          : 0;
        oldPatk = validItems[category][clickIndex[category]].properties.bDam
          ? validItems[category][clickIndex[category]].properties.bDam
          : 0;
        oldPdef = validItems[category][clickIndex[category]].properties.prot
          ? validItems[category][clickIndex[category]].properties.prot
          : 0;
        oldSpeed = validItems[category][clickIndex[category]].properties.speed
          ? validItems[category][clickIndex[category]].properties.speed
          : 0;
        oldAccuracy = validItems[category][clickIndex[category]].properties
          .accuracy
          ? validItems[category][clickIndex[category]].properties.accuracy
          : 0;
      }
      console.log(oldPatk);

      //Bdam to PAtk
      //prot to Pdef
      let tempObject = {
        xp:
          characterProperties.xp -
          oldXp +
          (selectedItemProperties.xp ? selectedItemProperties.xp : 0),
        hp:
          characterProperties.hp -
          oldHp +
          (selectedItemProperties.hp ? selectedItemProperties.hp : 0),
        mp:
          characterProperties.mp -
          oldMp +
          (selectedItemProperties.mp ? selectedItemProperties.mp : 0),
        Patk:
          characterProperties.Patk -
          oldPatk +
          (selectedItemProperties.bDam ? selectedItemProperties.bDam : 0),
        Pdef:
          characterProperties.Pdef -
          oldPdef +
          (selectedItemProperties.prot ? selectedItemProperties.prot : 0),
        speed:
          characterProperties.speed -
          oldSpeed +
          (selectedItemProperties.speed ? selectedItemProperties.speed : 0),
        accuracy:
          characterProperties.accuracy -
          oldAccuracy +
          (selectedItemProperties.accuracy
            ? selectedItemProperties.accuracy
            : 0),
      };
      console.log(tempObject.xp);
      setCharacterProperties(tempObject);

      console.log(characterProperties);
      console.log(selectedItemProperties);

      // 2. Updating clicked item index
      let tempClickIndex = clickIndex;
      tempClickIndex[category] = index;
      setClickIndex(tempClickIndex);
    }
  };

  return (
    <div className={classes.background}>
      <h3 htmlFor="category" className={classes.title}>
        ITEMS
      </h3>
      {actualCase === 0 && (
        <div>
          <Loader />
        </div>
      )}
      {validItems.length === 0 && (
        <div>
          <div>
            <p className={classes.notFound}>No Item</p>
          </div>
        </div>
      )}
      {actualCase === 2 && (
        <div className={classes.scroll}>
          <div htmlFor="weapon">
            {validItems["weapon"].length !== 0 && (
              <h3 htmlFor="category" className={classes.subtitle}>
                Weapon
              </h3>
            )}

            {validItems["weapon"].map((item, index) => {
              return (
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <IconButton style={{ margin: 0, padding: 0 }}>
                      <KeyboardArrowLeft
                        style={{ color: "white", fontSize: 40 }}
                      />
                    </IconButton>
                  </div>
                  <div
                    className={classes.sectionWrapper}
                    onClick={() => updateCharacterProperties(index, "weapon")}
                  >
                    <SingleCharacterItem
                      item={item}
                      clickedIndex={clickIndex["weapon"]}
                      itemIndex={index}
                    />
                  </div>
                  <div>
                    {" "}
                    <IconButton style={{ margin: 0, padding: 0 }}>
                      <KeyboardArrowRight
                        style={{ color: "white", fontSize: 40 }}
                      />
                    </IconButton>
                  </div>
                </div>
              );
            })}
          </div>
          <div htmlFor="helmet">
            {validItems["helmet"].length !== 0 && (
              <h3 htmlFor="category" className={classes.subtitle}>
                Helmet
              </h3>
            )}

            {validItems["helmet"].map((item, index) => {
              return (
                <div>
                  <div
                    className={classes.sectionWrapper}
                    onClick={() => updateCharacterProperties(index, "helmet")}
                  >
                    <SingleCharacterItem
                      item={item}
                      clickedIndex={clickIndex["helmet"]}
                      itemIndex={index}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div htmlFor="wing">
            {validItems["wing"].length !== 0 && (
              <h3 htmlFor="category" className={classes.subtitle}>
                Wing
              </h3>
            )}

            {validItems["wing"].map((item, index) => {
              return (
                <div>
                  <div
                    className={classes.sectionWrapper}
                    onClick={() => updateCharacterProperties(index, "wing")}
                  >
                    <SingleCharacterItem
                      item={item}
                      clickedIndex={clickIndex["wing"]}
                      itemIndex={index}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div htmlFor="armor">
            {validItems["armor"].length !== 0 && (
              <h3 htmlFor="category" className={classes.subtitle}>
                Armor
              </h3>
            )}

            {validItems["armor"].map((item, index) => {
              return (
                <div>
                  <div
                    className={classes.sectionWrapper}
                    onClick={() => updateCharacterProperties(index, "armor")}
                  >
                    <SingleCharacterItem
                      item={item}
                      clickedIndex={clickIndex["armor"]}
                      itemIndex={index}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div htmlFor="mount">
            {validItems["mount"].length !== 0 && (
              <h3 htmlFor="category" className={classes.subtitle}>
                Mount
              </h3>
            )}

            {validItems["mount"].map((item, index) => {
              return (
                <div>
                  <div
                    className={classes.sectionWrapper}
                    onClick={() => updateCharacterProperties(index, "mount")}
                  >
                    <SingleCharacterItem
                      item={item}
                      clickedIndex={clickIndex["mount"]}
                      itemIndex={index}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const mapStateToProps = (state) => ({
  authenticated: state.auth.authenticated,
  useritems: state.items.useritems,
});

const mapDispatchToProps = { getUserItems, getItemDetails };

export default connect(mapStateToProps, mapDispatchToProps)(CharacterItems);
