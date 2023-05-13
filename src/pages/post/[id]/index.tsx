import { GetStaticProps, NextPage } from "next";
import { generateSSGHelper } from "~/server/helpers/ssgHelper";
import { RouterOutputs } from "~/utils/api";

type Pet = RouterOutputs["pet"]["getById"];

const PetPage: NextPage<{ pet: Pet }> = ({ pet }) => {
  console.log(pet);
  return <div>Pet</div>;
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = generateSSGHelper();
  const id = context.params?.id;

  if (typeof id !== "string") throw new Error("no pet id");

  const pet = await ssg.pet.getById.prefetch({ id });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      pet,
    },
  };
};

export default PetPage;
