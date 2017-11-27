var kafka = require('kafka-node');

function ConnectionProvider() {
    this.getConsumer = function(topic_name) {
        if (!this.kafkaConsumerConnection) {
            this.client = new kafka.Client("localhost:2181");
            this.kafkaConsumerConnection = new kafka.Consumer(this.client,[ { topic: topic_name, partition: 0 }]);
            this.client.on('ready', function () { 
                //console.log('consumer ready!') 
            })
        }
        return this.kafkaConsumerConnection;
    };

    //Code will be executed when we start Producer
    this.getProducer = function() {
        if (!this.kafkaProducerConnection) {
            this.client = new kafka.Client("localhost:2181");
            this.kafkaProducerConnection = new kafka.HighLevelProducer(this.client);
            this.client.on('ready', function () { 
                //console.log('producer ready!') 
            })
        }
        return this.kafkaProducerConnection;
    };
}
exports = module.exports = new ConnectionProvider;