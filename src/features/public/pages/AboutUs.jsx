import aboutMainImage from "../../../shared/assets/aboutMainImage.png";
import CarouselSlide from "../../../shared/components/CarouselSlide";
import HomeLayout from "../../../shared/layouts/HomeLayout";
import { celebrities } from "../../../shared/utils/CelebrityData";

function AboutUs() {

    return (
        <HomeLayout>
            <div className="min-h-screen py-24 px-4 flex flex-col items-center justify-center bg-gray-900 transition-colors duration-500">
                <div className="flex flex-col lg:flex-row items-center gap-10 max-w-7xl mx-auto px-4 lg:px-10">
                    <section className="w-full lg:w-1/2 space-y-8 bg-gray-800/50 backdrop-blur-md p-10 rounded-2xl shadow-2xl border border-gray-700/50">
                        <h1 className="text-4xl lg:text-5xl font-bold tracking-wide text-gray-100 leading-tight">
                            Affordable and <span className="text-yellow-500">quality education</span>
                        </h1>
                        <p className="text-lg text-gray-300 leading-relaxed font-medium">
                            Our goal is to provide the affordable and quality education to the world. 
                            We are providing the platform for the aspiring teachers and students to share
                            their skills, creativity and knowledge to each other to empower and contribute
                            in the growth and wellness of mankind.  
                        </p>
                    </section>

                    <div className="w-full lg:w-1/2 flex justify-center">
                        <div className="relative">
                            <div className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full"></div>
                            <img
                                id="test1"
                                alt="about main image"
                                className="drop-shadow-2xl relative z-10 transition-transform duration-500 hover:scale-105"
                                src={aboutMainImage}
                            />
                        </div>
                    </div>
                </div>

                <div className="carousel w-full max-w-3xl m-auto my-24 bg-gray-800/50 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-gray-700/50">
                    {celebrities && celebrities.map(celebrity => (<CarouselSlide 
                                                                    {...celebrity} 
                                                                    key={celebrity.slideNumber} 
                                                                    totalSlides={celebrities.length}
                                                                    
                                                                />))}
                    
                </div>
            </div>
        </HomeLayout>  
    );
}   


export default AboutUs;