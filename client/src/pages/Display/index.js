import * as React from 'react';
import { makeStyles, styled } from '@mui/material/styles';
import axios from 'axios'
import { useState, useEffect } from 'react'
// import { QUERY_RECIPES } from '../../utils/queries'
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Grid from '@mui/material/Grid';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
// import Container from '@mui/material/container'
import "./styles.css"
import background from '../../images/background.jpg'

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));




function Display({ title }) {


  const [recipes, setRecipeData] = useState([])
  useEffect(() => {
    axios
      .get("/recipe")
      .then((res) => {
        console.log(res)
        setRecipeData(res.data)
      })
      .catch((err) => console.log(err, "There is an error"))

  }, [])

  const [expanded, setExpanded] = React.useState(false);
  const handleExpandClick = (id) => {
    setExpanded(expanded => ({
      ...expanded,
      [id]: !expanded[id],
    }));
  };

  console.log(recipes)
  if (!recipes.length) {
    return <h3>No Recipes Yet!</h3>
  }

  function toBase64(arr) {
    //arr = new Uint8Array(arr) if it's an ArrayBuffer
    return btoa(
      arr.reduce((data, byte) => data + String.fromCharCode(byte), '')
    );
  }
  //This toBase64 function will take the img data that was deconstructed down to 64bit code from Multer and convert it back so that it can render the image on the screen. If using the express route to do this, the picture data is in the field that it was called. In our case picture, then data which is a subfield holding all the data of picture, then data again where there is the 64bit code being held in a large array. In short too acess the code it will be picture.data.data (Refer to line 73)
  return (
    <div className="container" style={{ color: 'Black', fontWeight: 'bold', paddingTop: '25px', backgroundSize: 'cover' }} >

      <Grid container spacing={{ xs: 3, md: 4 }} columns={{ xs: 3, sm: 4, md: 6, lg: 12 }} >
        {recipes && recipes.map((recipe) => (
          <Grid item xs={3} md={4} key={recipe.id}>
            <Grid item xs={4} style={{ padding: '10%' }}>
              <Card sx={{ width: 500 }}>
                <CardHeader style={{ paddingLeft: "30%" }}
                  title={recipe.recipeName}
                />
                <CardMedia style={{ height: 545 }}
                  component="img"
                  height="194"
                  image={`data:image/png;base64,${toBase64(recipe.picture.data.data)}`}
                  alt="recipe image"
                />

                <CardActions disableSpacing>
                  Click to show recipe!
                  <ExpandMore
                    expand={expanded}
                    onClick={(_id) => handleExpandClick(recipe._id)}
                    aria-expanded={expanded}
                    aria-label="show more"
                  >
                    <ExpandMoreIcon />
                  </ExpandMore>
                </CardActions>
                <Collapse in={expanded[recipe._id]} timeout="auto" unmountOnExit>
                  <CardContent>
                    <Typography paragraph>Cooking Time: {recipe.cookingTime} Minutes</Typography>
                    <Typography paragraph>Equipment:  {'  '}
                      {recipe.equipment}
                    </Typography>
                    <Typography paragraph>
                      Ingredients Required: {'  '}
                      {recipe.ingredients}
                    </Typography>
                    <Typography paragraph>
                      Instructions:  {'  '}
                      {recipe.instructions}
                    </Typography>

                  </CardContent>
                </Collapse>
              </Card>
            </Grid>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
export default Display