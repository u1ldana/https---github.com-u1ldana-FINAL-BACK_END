const Blog = require('../mongo/Blog');
//
exports.getBlogs = async () => {
    try {
        const blogs = await Blog.find().sort({ createdAt: -1 });
        console.log('Blogs retrieved:', blogs);
        return blogs;
    } catch (error) {
        console.error('Error in controller:', error);
        throw error;
    }
};

exports.getBlogByID = async (req, res) => {
    try {
        const blog = await Blog.findById(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json(blog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.createBlog = async (req) => {
    try {
        const { title, body } = req.body;
        
        if (!title || !body) {
            throw new Error('Both title and body are mandatory');
        }

        const blog = new Blog({
            title,
            body,
            author: req.session?.user?.username || 'Anonymous'
        });

        const savedBlog = await blog.save();
        console.log('Blog saved:', savedBlog); 
        return savedBlog;
    } catch (error) {
        console.error('Error in controller:', error);
        throw error;
    }
};

exports.updateBlog = async (req, res) => {
    try {
        const { title, body } = req.body;
        if (!title || !body) {
            return res.status(400).json({ message: "Title and body are both required!" });
        }

        const updatedBlog = await Blog.findByIdAndUpdate(
            req.params.id,
            { title, body },
            { new: true, runValidators: true }
        );

        if (!updatedBlog) {
            return res.status(404).json({ message: "Blog not found" });
        }

        res.status(200).json(updatedBlog);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.deleteBlog = async (req, res) => {
    try {
        const blog = await Blog.findByIdAndDelete(req.params.id);
        if (!blog) {
            return res.status(404).json({ message: "Blog not found" });
        }
        res.status(200).json({ message: "Blog successfully deleted!" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
