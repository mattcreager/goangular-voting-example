require('harp')
  .server(__dirname, { port: process.env.PORT || 5010 });

console.info('Your HARP server has been started on Port 5010');
