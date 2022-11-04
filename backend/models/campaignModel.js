import mongoose from "mongoose";

const campaignSchema = mongoose.Schema(
  {
    // user: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   required: true,
    //   ref: "User"
    // },
    // // FOR FUTURE REF
    // // campaign: {
    // //     type: mongoose.Schema.Types.ObjectId,
    // //     required: true,
    // //     ref: "Campaign"
    // //   },
    name: {
      type: String,
      required: true,
      ref: "CampaignId"
    },
    title: {
      type: String
      // required: true
    },
    image: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    total: {
      type: Number,
      required: true,
      default: 0
    },
    raised: {
      type: Number,
      required: true,
      default: 0
    },
    type:{
      type : String,
      required : true
    }
  },
  {
    timestamps: true
  }
);

const donationSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User"
  },
  campaignName: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "CampaignId"
  },
  donation: {
    type: Number,
    required: true
  }
});

const Campaign = mongoose.model("Campaign", campaignSchema);
const Donation = mongoose.model("Donation", donationSchema);

export { Campaign, Donation };
