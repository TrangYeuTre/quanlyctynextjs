
const HomeRoute = (props) => {
  const arr1 = ['nghia','trang','sushi']
  const arr2 = ['tèo','trang','nghia']
  console.log(new Set([...arr1,...arr2]))
  return <h1>Trang tổng quan</h1>;
};

export default HomeRoute;
