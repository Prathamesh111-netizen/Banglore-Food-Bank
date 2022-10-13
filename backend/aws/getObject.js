import AWS from "aws-sdk";

const getImageUrl = (Key) => {
	AWS.config.update({
		accessKeyId: process.env.accessKeyId,
		secretAccessKey: process.env.secretAccessKey,
		region: "ap-south-1",
		signatureVersion: "v4"
	});

	const s3 = new AWS.S3();
	const myBucket = process.env.s3Bucket;
	const signedUrlExpireSeconds = 60 * 60;

	return s3.getSignedUrl("getObject", {
		Bucket: myBucket,
		Key,
		Expires: signedUrlExpireSeconds
	});
};

export default getImageUrl;
