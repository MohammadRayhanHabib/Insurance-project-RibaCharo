import BannerSlider from "../../components/Home/Banner"
import Banner from "../../components/Home/Banner"
import HeroSection from "../../components/Home/Banner"
import CustomerReviews from "../../components/Home/CustomerReviews"
import PopularPolicies from "../../components/Home/PopularPolicies"


const Home = () => {
    return (
        <div className="max-w-[1660px] mx-auto ">
            <BannerSlider></BannerSlider>
            <PopularPolicies></PopularPolicies>
            <CustomerReviews></CustomerReviews>

        </div>
    )
}

export default Home
