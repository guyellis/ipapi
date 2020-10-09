let counter = 1;

export const logAction = (message: string): (msg2?: string) => void => {
  const id = counter++;
  console.log(`#${id}. Starting: ${message}`);
  const timeStart = Date.now();
  // const dotWriter = setInterval(() => {
  //   process.stdout.write('.');
  // }, 500);
  
  return (message2?: string): void => {
    const timeTakenMilliseconds = Date.now() - timeStart;
    const timeTakenSeconds = Math.round((timeTakenMilliseconds / 100)) / 10;
    // clearInterval(dotWriter);
    console.log(`#${id}. Finished: ${message}`);
    if (message2) {
      console.log(`#${id}. ${message2}`);
    }
    console.log(`#${id}. Time taken: ${timeTakenSeconds}s`);
    console.log();
  };
};
