import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useShop } from '../../services/ShopContext';
import { useAuth } from '../../services/AuthContext';
import { getImageUrl } from '../../services/config';
import CommentsSection from "./CommentSection";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ShoppingCart } from "lucide-react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const SinglePost = () => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [slugField, setSlugField] = useState('');
  const [image, setImage] = useState('');
  const [uploading, setUploading] = useState(false);

  const { api, updatePost, user } = useAuth();
  const { addToCart } = useShop();
  const { slug } = useParams();
  const goBack = useNavigate();

  const fetchPost = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get(`/posts/${slug}`);
      setPost(response.data);

      setTitle(response.data.title);
      setDescription(response.data.description);
      setSlugField(response.data.slug);
      setImage(response.data.images);
    } catch (err) {
      setError("Nie udało się pobrać posta");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [slug, api]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setImage(data);
      setUploading(false);
    } catch (error) {
      console.error(error);
      setUploading(false);
      alert('Błąd uploadu');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await updatePost(post._id, { title, description, slug: slugField, image });

      setIsEditing(false);
      if (slugField !== slug) {
        goBack(`/blog/${slugField}`);
      } else {
        await fetchPost();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Nie udało się zaktualizować posta.');
    }
  };

  const deletePostHandler = async () => {
    if (!window.confirm("Czy na pewno chcesz usunąć ten post?")) return;
    try {
      await api.delete(`/posts/${post._id}`);
      goBack("/");
    } catch (err) {
      alert("Nie udało się usunąć posta");
    }
  };

  const handleAddToCart = (product) => {
    addToCart(product, 1);
    alert("Dodano produkt do koszyka!");
  };

  if (loading) return <div>Ładowanie...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;
  if (!post) return <p>Post nie istnieje</p>;

  return (
    <div className="container mx-auto p-6 flex justify-center">
      <div className='w-full max-w-4xl'>
        <div className="mb-4">
          {/* Przyciski edycji widoczne tylko dla admina/autora */}
          {user && (
            <>
              <Button className='bg-blue-500 mr-2' onClick={() => setIsEditing(!isEditing)}>
                {isEditing ? 'Anuluj edycję' : 'Edytuj post'}
              </Button>
              <Button variant="destructive" onClick={deletePostHandler}>Usuń post</Button>
            </>
          )}
        </div>

        {!isEditing ? (
          <div className='overflow-hidden rounded-lg shadow-lg bg-white'>
            <div className="w-full flex justify-center">
              {post.images && post.images.length > 0 ? (
                <Carousel className="w-full max-w-lg">
                  <CarouselContent>
                    {post.images.map((img, index) => (
                      <CarouselItem key={index}>
                        <div className="p-1">
                          <div className="flex aspect-square items-center justify-center overflow-hidden rounded-xl border bg-white shadow-sm">
                            <img
                              src={getImageUrl(img)}
                              alt={`${post.title} - zdjęcie ${index + 1}`}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {post.images.length > 1 && (
                    <>
                      <CarouselPrevious className="left-2" />
                      <CarouselNext className="right-2" />
                    </>
                  )}
                </Carousel>
              ) : (
                <div className="aspect-square w-full max-w-lg bg-gray-100 flex items-center justify-center rounded-xl text-gray-400">
                  Brak zdjęć posta
                </div>
              )}
            </div>

            <div className="p-8">
              <div className="flex justify-between items-center text-gray-500 text-sm mb-4">
                <time>{new Date(post.createdAt).toLocaleDateString()}</time>
                <span>Autor: {post.userId?.firstName} {post.userId?.lastName}</span>
              </div>

              <h1 className="text-4xl font-bold mb-6 text-gray-900">{post.title}</h1>

              <div className="prose max-w-none text-gray-700 text-lg leading-relaxed whitespace-pre-line mb-10">
                {post.description}
              </div>

              {post.products && post.products.length > 0 && (
                <div className="mt-12 mb-8">
                  <h3 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">
                    Produkty z tego wpisu
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {post.products.map((product) => (
                      <Card key={product._id} className="flex flex-col h-full hover:shadow-md transition-shadow">
                        <CardHeader className="p-0">
                          <Link to={`/product/${product.slug}`} className="block aspect-square overflow-hidden rounded-t-lg bg-gray-50">
                            <img
                              src={getImageUrl(product.image || product.images?.[0])}
                              alt={product.name}
                              className="w-full h-full object-contain p-4 hover:scale-105 transition-transform"
                            />
                          </Link>
                        </CardHeader>
                        <CardContent className="flex-grow p-4">
                          <Link to={`/product/${product.slug}`}>
                            <CardTitle className="text-lg hover:text-blue-600 transition-colors mb-2">
                              {product.name}
                            </CardTitle>
                          </Link>
                          <div className="text-xl font-bold text-gray-900">
                            {product.price?.toFixed(2)} zł
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button
                            className="w-full flex items-center gap-2"
                            onClick={() => handleAddToCart(product)}
                          >
                            <ShoppingCart className="w-4 h-4" />
                            Dodaj do koszyka
                          </Button>
                        </CardFooter>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="bg-gray-50 p-8 border-t">
              <CommentsSection
                postId={post._id}
                comments={post.comments || []}
                onCommentAdded={fetchPost}
              />
            </div>
          </div>
        ) : (
          <div className='w-full mt-5'>
            <Card>
              <CardHeader>
                <CardTitle>Edytuj post</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} id='edit-post-form' className="space-y-4">
                  <div className="grid gap-2">
                    <Label htmlFor="title">Tytuł</Label>
                    <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="slug">Slug (URL)</Label>
                    <Input id="slug" value={slugField} onChange={(e) => setSlugField(e.target.value)} required />
                  </div>

                  <div className="grid gap-2">
                    <Label>Zdjęcie</Label>
                    <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="/uploads/..." />
                    <Input type="file" onChange={uploadFileHandler} disabled={uploading} />
                    {uploading && <p className="text-sm">Wysyłanie...</p>}
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="description">Treść</Label>
                    <Textarea
                      id="description"
                      className="min-h-[200px]"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                </form>
              </CardContent>
              <CardFooter>
                <Button type="submit" form='edit-post-form' className="w-full">
                  Zapisz zmiany
                </Button>
              </CardFooter>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}

export default SinglePost;