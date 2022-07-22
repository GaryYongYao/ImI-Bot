const GweitoWei = (gwei) => gwei * 1000000000;
const weiToEth = (wei) => wei / 1000000000000000000;

const deleteMsg = async (msg) => {
  await msg.delete();
  console.log(`Deleted message from ${msg.author.username}`);
}

module.exports = {
  deleteMsg,
  GweitoWei,
  weiToEth
}