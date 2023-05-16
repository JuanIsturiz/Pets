import {
  Card,
  CardBody,
  Grid,
  GridItem,
  ScaleFade,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";

const LoadingPet: React.FC<{ quantity: number }> = ({ quantity }) => {
  return (
    <>
      {Array(quantity)
        .fill(null)
        .map((_skeleton, idx) => (
          <ScaleFade key={idx} in={true} initialScale={0.9} delay={idx * 500}>
            <Card mb={4}>
              <CardBody>
                <Grid templateColumns={"1fr 2fr"} gap={2}>
                  <GridItem>
                    <Skeleton height={250} />
                  </GridItem>
                  <GridItem fontSize={"xl"}>
                    <Grid templateColumns={"repeat(2, 1fr)"} gap={4}>
                      <GridItem>
                        <Skeleton height={8} mb={4} />
                        <Skeleton height={8} mb={4} />
                        <Skeleton height={8} mb={4} />
                      </GridItem>
                      <GridItem>
                        <Skeleton height={8} mb={4} />
                        <Skeleton height={8} mb={4} />
                        <Skeleton height={8} mb={4} />
                      </GridItem>
                    </Grid>
                    <Skeleton height={8} w={"48%"} mb={4} />
                    <SkeletonText />
                  </GridItem>
                </Grid>
              </CardBody>
            </Card>
          </ScaleFade>
        ))}
    </>
  );
};

export default LoadingPet;
