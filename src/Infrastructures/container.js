/* istanbul ignore file */

const { createContainer } = require('instances-container');

// external agency
const { nanoid } = require('nanoid');
const bcrypt = require('bcrypt');
const Jwt = require('@hapi/jwt');
const pool = require('./database/postgres/pool');

// security
const PasswordHash = require('../Applications/security/PasswordHash');
const BcryptPasswordHash = require('./security/BcryptPasswordHash');
const JwtTokenManager = require('./security/JwtTokenManager');
const AuthenticationTokenManager = require('../Applications/security/AuthenticationTokenManager');

// repository
const ThreadRepository = require('../Domains/threads/ThreadRepository');
const ThreadQueryRepository = require('../Domains/threads/ThreadQueryRepository');
const UserRepository = require('../Domains/users/UserRepository');
const AuthenticationRepository = require('../Domains/authentications/AuthenticationRepository');
const CommentRepository = require('../Domains/comments/CommentRepository');
const ReplyRepository = require('../Domains/replies/ReplyRepository');

// implementation write repository
const UserRepositoryPostgres = require('./repository/write/UserRepositoryPostgres');
const AuthenticationRepositoryPostgres = require('./repository/write/AuthenticationRepositoryPostgres');
const ThreadRepositoryPostgres = require('./repository/write/ThreadRepositoryPostgres');
const CommentRepositoryPostgres = require('./repository/write/CommentRepositoryPostgres');
const ReplyRepositoryPostgres = require('./repository/write/ReplyRepositoryPostgres');

// implementation read repository
const ThreadQueryRepositoryPostgres = require('./repository/read/ThreadQueryRepositoryPostgres');

// use case
const AddUserUseCase = require('../Applications/use_case/users/AddUserUseCase');

const LoginUserUseCase = require('../Applications/use_case/authentications/LoginUserUseCase');
const LogoutUserUseCase = require('../Applications/use_case/authentications/LogoutUserUseCase');
const RefreshAuthenticationUseCase = require('../Applications/use_case/authentications/RefreshAuthenticationUseCase');

const AddThreadUseCase = require('../Applications/use_case/threads/AddThreadUseCase');
const GetThreadUseCase = require('../Applications/use_case/threads/GetThreadUseCase');

const AddCommentUseCase = require('../Applications/use_case/comments/AddCommentUseCase');
const DeleteCommentUseCase = require('../Applications/use_case/comments/DeleteCommentUseCase');

const AddReplyUseCase = require('../Applications/use_case/replies/AddReplyUseCase');
const DeleteReplyUseCase = require('../Applications/use_case/replies/DeleteReplyUseCase');

// creating container
const container = createContainer();

// registering services and repository
container.register([
	{
		key: UserRepository.name,
		Class: UserRepositoryPostgres,
		parameter: {
			dependencies: [
				{
					concrete: pool,
				},
				{
					concrete: nanoid,
				},
			],
		},
	},
	{
		key: AuthenticationRepository.name,
		Class: AuthenticationRepositoryPostgres,
		parameter: {
			dependencies: [
				{
					concrete: pool,
				},
			],
		},
	},
	{
		key: ThreadRepository.name,
		Class: ThreadRepositoryPostgres,
		parameter: {
			dependencies: [
				{
					concrete: pool,
				},
				{
					concrete: nanoid,
				},
			],
		},
	},
	{
		key: PasswordHash.name,
		Class: BcryptPasswordHash,
		parameter: {
			dependencies: [
				{
					concrete: bcrypt,
				},
			],
		},
	},
	{
		key: AuthenticationTokenManager.name,
		Class: JwtTokenManager,
		parameter: {
			dependencies: [
				{
					concrete: Jwt.token,
				},
			],
		},
	},
	{
		key: CommentRepository.name,
		Class: CommentRepositoryPostgres,
		parameter: {
			dependencies: [
				{
					concrete: pool,
				},
				{
					concrete: nanoid,
				},
			],
		},
	},
	{
		key: ThreadQueryRepository.name,
		Class: ThreadQueryRepositoryPostgres,
		parameter: {
			dependencies: [
				{
					concrete: pool,
				},
			],
		},
	},
	{
		key: ReplyRepository.name,
		Class: ReplyRepositoryPostgres,
		parameter: {
			dependencies: [
				{
					concrete: pool,
				},
				{
					concrete: nanoid,
				},
			],
		},
	},
]);

// registering use cases
container.register([
	{
		key: AddUserUseCase.name,
		Class: AddUserUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'userRepository',
					internal: UserRepository.name,
				},
				{
					name: 'passwordHash',
					internal: PasswordHash.name,
				},
			],
		},
	},
	{
		key: LoginUserUseCase.name,
		Class: LoginUserUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'userRepository',
					internal: UserRepository.name,
				},
				{
					name: 'authenticationRepository',
					internal: AuthenticationRepository.name,
				},
				{
					name: 'authenticationTokenManager',
					internal: AuthenticationTokenManager.name,
				},
				{
					name: 'passwordHash',
					internal: PasswordHash.name,
				},
			],
		},
	},
	{
		key: LogoutUserUseCase.name,
		Class: LogoutUserUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'authenticationRepository',
					internal: AuthenticationRepository.name,
				},
			],
		},
	},
	{
		key: RefreshAuthenticationUseCase.name,
		Class: RefreshAuthenticationUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'authenticationRepository',
					internal: AuthenticationRepository.name,
				},
				{
					name: 'authenticationTokenManager',
					internal: AuthenticationTokenManager.name,
				},
			],
		},
	},
	{
		key: AddThreadUseCase.name,
		Class: AddThreadUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'threadRepository',
					internal: ThreadRepository.name,
				},
			],
		},
	},
	{
		key: AddCommentUseCase.name,
		Class: AddCommentUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'commentRepository',
					internal: CommentRepository.name,
				},
				{
					name: 'threadRepository',
					internal: ThreadRepository.name,
				},
			],
		},
	},
	{
		key: DeleteCommentUseCase.name,
		Class: DeleteCommentUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'commentRepository',
					internal: CommentRepository.name,
				},
				{
					name: 'threadRepository',
					internal: ThreadRepository.name,
				},
			],
		},
	},
	{
		key: GetThreadUseCase.name,
		Class: GetThreadUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'threadQueryRepository',
					internal: ThreadQueryRepository.name,
				},
			],
		},
	},
	{
		key: AddReplyUseCase.name,
		Class: AddReplyUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'threadRepository',
					internal: ThreadRepository.name,
				},
				{
					name: 'commentRepository',
					internal: CommentRepository.name,
				},
				{
					name: 'replyRepository',
					internal: ReplyRepository.name,
				},
			],
		},
	},
	{
		key: DeleteReplyUseCase.name,
		Class: DeleteReplyUseCase,
		parameter: {
			injectType: 'destructuring',
			dependencies: [
				{
					name: 'replyRepository',
					internal: ReplyRepository.name,
				},
				{
					name: 'commentRepository',
					internal: CommentRepository.name,
				},
				{
					name: 'threadRepository',
					internal: ThreadRepository.name,
				},
			],
		},
	},
]);

module.exports = container;
